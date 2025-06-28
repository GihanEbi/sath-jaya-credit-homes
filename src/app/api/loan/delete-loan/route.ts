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
  const { loanID } = await req.json();

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

  // check the loan is not in ongoing state
  if (existingLoan.loanStatus === loanConstants.status.ongoing) {
    return NextResponse.json({
      success: false,
      message: "Loan is in ongoing state. Cannot delete.",
      status: 400,
    });
  }

  // ----------- delete the loan -----------
  try {
    await LoanModel.deleteOne({ ID: loanID });
    return NextResponse.json({
      success: true,
      message: "Loan deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error deleting loan",
      status: 500,
    });
  }
}
