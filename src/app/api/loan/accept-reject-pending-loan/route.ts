import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { CheckUserAccess } from "@/services/auth services/auth-service";
import LoanModel from "../../../../../models/LoanModel";
import { loanConstants } from "@/constants/loan_constants";
import { access_levels } from "@/constants/access_constants";

type isValidTokenTypes = {
  success: boolean;
  access: string;
  status?: number;
  // Optional userId if needed for further processing
  userId?: string;
};

export async function POST(req: Request) {
  const { loanID, action, rejectedReason } = await req.json();

  // ----------- check if the token provided in headers -----------
  const tokenString = req.headers.get("token");
  if (!tokenString) {
    return NextResponse.json(
      { success: false, message: "Token is required" },
      { status: 401 },
    );
  }
  const checkResult = await CheckUserAccess(
    tokenString,
    access_levels.ApproveRejectLoan,
  );
  const isValidToken: isValidTokenTypes = {
    success: checkResult.success,
    access: checkResult.access ?? "",
    userId: checkResult.userId,
  };

  if (!isValidToken.success) {
    return NextResponse.json(
      { success: isValidToken.success, message: "Unauthorized" },
      { status: 403 },
    );
  }

  //   --------- connect to database -----------
  await connectDB();

  // ------------ Check if loan already exists in other collections -----------
  const existingLoan = await LoanModel.findOne({ ID: loanID });
  if (!existingLoan) {
    return NextResponse.json({
      success: false,
      message: "Loan not found",
      status: 404,
    });
  }

  // ----------- check if the loan already in pending state -----------
  if (existingLoan.loanStatus !== loanConstants.status.pending) {
    return NextResponse.json({
      success: false,
      message: "Loan is not in pending state. Cannot accept or reject.",
      status: 400,
    });
  }

  //   check if the action is approved or rejected
  if (
    action !== loanConstants.status.approved &&
    action !== loanConstants.status.rejected
  ) {
    return NextResponse.json({
      success: false,
      message: "Invalid action. Must be 'approved' or 'rejected'.",
      status: 400,
    });
  }

  // ----------- accept or reject the loan -----------
  let updatedLoan;
  try {
    if (action === loanConstants.status.approved) {
      updatedLoan = await LoanModel.findOneAndUpdate(
        { ID: loanID },
        { loanStatus: action, approvedBy: isValidToken.userId },
        { new: true },
      );
    } else if (action === loanConstants.status.rejected) {
      updatedLoan = await LoanModel.findOneAndUpdate(
        { ID: loanID },
        {
          loanStatus: action,
          rejectedBy: isValidToken.userId,
          rejectedReason: rejectedReason,
        },
        { new: true },
      );
    }

    if (!updatedLoan) {
      return NextResponse.json({
        success: false,
        message: "Error updating loan status",
        status: 500,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Loan status ${action === loanConstants.status.approved ? "approved" : "rejected"} successfully`,
      data: updatedLoan,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error updating loan status",
      status: 500,
    });
  }
}
