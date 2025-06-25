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

  // ----------- check if the loan already in ongoing state -----------
  if (existingLoan.loanStatus !== loanConstants.status.ongoing) {
    return NextResponse.json({
      success: false,
      message: "Loan is not in ongoing state. Cannot complete.",
      status: 400,
    });
  }

  //   check if the action is complete
  if (action !== loanConstants.status.completed) {
    return NextResponse.json({
      success: false,
      message: "Invalid action. Must be 'completed'.",
      status: 400,
    });
  }

  //   check if the status of the loanInstallmentsHistory array is complete in the all object
  const allInstallmentsCompleted = existingLoan.loanInstallmentsHistory.every(
    (installment: any) =>
      installment.status === loanConstants.installmentStatus.paid,
  );

  if (!allInstallmentsCompleted) {
    return NextResponse.json({
      success: false,
      message: "All installments must be completed to finalize the loan.",
      status: 400,
    });
  }

  //   update the loan status to completed
  existingLoan.loanStatus = loanConstants.status.completed;
  await existingLoan.save();

  return NextResponse.json({
    success: true,
    message: "Loan completed successfully.",
    status: 200,
  });
}
