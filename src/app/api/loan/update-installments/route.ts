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
  const { loanID, installmentNo } = await req.json();

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

  //   set next installment date and amount
  let nextInstallmentDate: Date | undefined = undefined;
  let nextInstallmentAmount: number | undefined = undefined;

  if (nextInstallment) {
    nextInstallmentDate = nextInstallment.installmentDate;
    nextInstallmentAmount = nextInstallment.installmentAmount;
  } else {
    return NextResponse.json({
      success: false,
      message: "No pending installment found.",
      status: 404,
    });
  }
  existingLoan.nextInstallmentDate = nextInstallmentDate;
  existingLoan.nextInstallmentAmount = nextInstallmentAmount;

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
