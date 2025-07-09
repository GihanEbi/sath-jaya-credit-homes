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
  const {
    loanID,
    action,
    interestRate,
    installmentTime,
    noOfInstallments,
    loanStartingDate,
  } = await req.json();

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
    access_levels.SetToOngoingLoan,
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
  if (existingLoan.loanStatus !== loanConstants.status.approved) {
    return NextResponse.json({
      success: false,
      message: "Loan is not in approved state. Cannot set to ongoing.",
      status: 400,
    });
  }

  //   check if the action is approved or rejected
  if (action !== loanConstants.status.ongoing) {
    return NextResponse.json({
      success: false,
      message: "Invalid action. Must be 'ongoing'.",
      status: 400,
    });
  }

  //   set up the load calculation details
  let loanAmountWithInterest =
    existingLoan.loanAmount + (existingLoan.loanAmount * interestRate) / 100;

  let installmentAmount = loanAmountWithInterest / noOfInstallments;

  //   set loan installment history

  let installmentHistoryList = [];
  console.log("No of Installments:", noOfInstallments);

  for (let i = 0; i < noOfInstallments; i++) {
    console.log("Installment No:", i + 1);

    let installmentDate = new Date(loanStartingDate);
    installmentDate.setDate(
      installmentDate.getDate() + installmentTime * (i + 1),
    );

    installmentHistoryList.push({
      installmentNo: i + 1,
      installmentAmount,
      installmentDate,
      status: loanConstants.installmentStatus.pending,
    });
  }

  //   go through the loanInstallmentHistory and get the first object that have status pending for next installment date and amount
  const nextInstallment = installmentHistoryList.find(
    (installment: any) =>
      installment.status === loanConstants.installmentStatus.pending,
  );
  // if (!nextInstallment) {
  //     return NextResponse.json({
  //         success: false,
  //         message: "No pending installment found.",
  //         status: 404,
  //     });
  // }

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

  // ----------- ongoing the loan -----------
  let updatedLoan;
  try {
    updatedLoan = await LoanModel.findOneAndUpdate(
      { ID: loanID },
      {
        loanStatus: action,
        interestRate: interestRate.interestRate,
        installmentTime: installmentTime,
        noOfInstallments: noOfInstallments,
        loanStartedDate: loanStartingDate,
        loanInstallmentsHistory: installmentHistoryList,
        nextInstallmentDate: nextInstallmentDate,
        nextInstallmentAmount: nextInstallmentAmount,
        balanceLoanAmount: loanAmountWithInterest,
        ongoingBy: isValidToken.userId, // Set the user who set the loan to ongoing
      },
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
