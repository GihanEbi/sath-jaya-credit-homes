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
  const { loanID, installmentNo } = await req.json();

  // ----------- check if the token provided in headers -----------
  const tokenString = req.headers.get("token");
  if (!tokenString) {
    return NextResponse.json(
      { success: false, message: "Token is required" },
      { status: 401 },
    );
  }
  const checkResult = await CheckUserAccess(tokenString, access_levels.UpdateInstallment);
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
  if (existingLoan.loanStatus !== loanConstants.status.ongoing) {
    return NextResponse.json({
      success: false,
      message: "Loan is not in ongoing state. Cannot update installments.",
      status: 400,
    });
  }

  //   check if the installment no of loanInstallmentsHistory in existingLoan's status in not at the pending state
  const installment = existingLoan.loanInstallmentsHistory.find(
    (installment: any) => installment.installmentNo === installmentNo,
  );

  if (!installment) {
    return NextResponse.json({
      success: false,
      message: "Installment not found. May be all installments are paid.",
      status: 404,
    });
  }

  if (
    !installment ||
    installment.status === loanConstants.installmentStatus.paid
  ) {
    return NextResponse.json({
      success: false,
      message: "Installment is already paid. Cannot update.",
      status: 400,
    });
  }
  //    update the installment to paid in correct installmentNo in loanInstallmentsHistory
  installment.status = loanConstants.installmentStatus.paid;
  installment.paidDate = new Date();
  installment.approvedBy = isValidToken.userId; // Assuming userId is available in the token validation result

  //   go through the loanInstallmentHistory and get the first object that have status pending for next installment date and amount
  const nextInstallment = existingLoan.loanInstallmentsHistory.find(
    (installment: any) =>
      installment.status === loanConstants.installmentStatus.pending,
  );

  if (nextInstallment) {
    existingLoan.nextInstallmentDate = nextInstallment.installmentDate;
    existingLoan.nextInstallmentAmount = nextInstallment.installmentAmount;
  } else {
    existingLoan.nextInstallmentDate = null;
    existingLoan.nextInstallmentAmount = 0;
  }

  try {
    await existingLoan.save();
    return NextResponse.json({
      success: true,
      message: "Installment updated successfully",
      status: 200,
    });
  } catch (error) {
    console.log("Error updating installment:", error);

    return NextResponse.json({
      success: false,
      message: "Error updating installment",
      status: 500,
    });
  }
}
