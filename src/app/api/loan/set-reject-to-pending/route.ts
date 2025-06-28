import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { CheckUserAccess } from "@/services/auth services/auth-service";
import LoanModel from "../../../../../models/LoanModel";
import { loanConstants } from "@/constants/loan_constants";

type isValidTokenTypes = {
  success: boolean;
  message: string;
  status?: number;
  // Optional userId if needed for further processing
  userId?: string;
};

export async function POST(req: Request) {
  const { loanID, action } = await req.json();

  // ----------- check if the token provided in headers -----------
  const tokenString = req.headers.get("token");
  const isValidToken: isValidTokenTypes = CheckUserAccess(tokenString);

  if (!isValidToken.success) {
    return Response.json(
      { success: isValidToken.success, message: isValidToken.message },
      { status: isValidToken.status },
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

  // ----------- check if the loan already in rejected state -----------
  if (existingLoan.loanStatus !== loanConstants.status.rejected) {
    return NextResponse.json({
      success: false,
      message: "Loan is not in rejected state. Cannot accept or reject.",
      status: 400,
    });
  }

  //   check if the action is approved or rejected
  if (action !== loanConstants.status.pending) {
    return NextResponse.json({
      success: false,
      message: "Invalid action. Must be 'pending'.",
      status: 400,
    });
  }

  // ----------- accept or reject the loan -----------
  let updatedLoan;
  try {
    updatedLoan = await LoanModel.findOneAndUpdate(
      { ID: loanID },
      { loanStatus: action},
      { new: true },
    );

    if (!updatedLoan) {
      return NextResponse.json({
        success: false,
        message: "Error updating loan status",
        status: 500,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Loan status updated successfully`,
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
