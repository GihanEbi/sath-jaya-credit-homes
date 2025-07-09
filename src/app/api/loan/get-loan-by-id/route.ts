// -------------services-----------------
import { CheckUserAccess } from "@/services/auth services/auth-service";
import { connectDB } from "../../../../../lib/db";
import LoanModel from "../../../../../models/LoanModel";
import { NextResponse } from "next/server";
import { access_levels } from "@/constants/access_constants";

type isValidTokenTypes = {
  success: boolean;
  access: string;
  status?: number;
  // Optional userId if needed for further processing
  userId?: string;
};

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const loanID = searchParams.get("loanID");

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
    access_levels.GetLoans,
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
  try {
    const loan = await LoanModel.aggregate([
      {
        $match: { ID: loanID },
      },
      // STAGE 2: Look up the applicant details
      {
        $lookup: {
          from: "credit_users",
          localField: "applicantID",
          foreignField: "ID",
          as: "applicantDetails",
        },
      },
      {
        $lookup: {
          from: "credit_users",
          localField: "guarantorID1",
          foreignField: "ID",
          as: "guarantorDetails1",
        },
      },
      {
        $lookup: {
          from: "credit_users",
          localField: "guarantorID2",
          foreignField: "ID",
          as: "guarantorDetails2",
        },
      },
      {
        $lookup: {
          from: "credit_users",
          localField: "guarantorID3",
          foreignField: "ID",
          as: "guarantorDetails3",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "approvedBy",
          foreignField: "ID",
          as: "approvedByDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "rejectedBy",
          foreignField: "ID",
          as: "rejectedByDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "ongoingBy",
          foreignField: "ID",
          as: "ongoingByDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "completedBy",
          foreignField: "ID",
          as: "completedByDetails",
        },
      },
      {
        $project: {
          _id: 0,
          ID: 1,
          applicantID: 1,
          applicantFullName: {
            $arrayElemAt: ["$applicantDetails.fullName", 0],
          },
          guarantorFullName1: {
            $arrayElemAt: ["$guarantorDetails1.fullName", 0],
          },
          guarantorFullName2: {
            $arrayElemAt: ["$guarantorDetails2.fullName", 0],
          },
          guarantorFullName3: {
            $arrayElemAt: ["$guarantorDetails3.fullName", 0],
          },
          branchName: 1,
          centerName: 1,
          memberNo: 1,
          teamID: 1,
          purposeOfLoan: 1,
          mainIncomePerson: 1,
          mainIncomePersonPhoneNo: 1,
          mainIncomePersonNic: 1,
          monthlyFamilyIncome: 1,
          relationship: 1,
          loanBefore: 1,
          loanOrganization: 1,
          loanAmount: 1,
          installment: 1,
          balanceLoanAmount: 1,
          homeLocation: 1,
          shearedApplicantFullName: 1,
          shearedApplicantAddress: 1,
          shearedApplicantPhoneNo: 1,
          shearedApplicantNic: 1,
          shearedApplicantBirthday: 1,
          shearedApplicantMaritalStatus: 1,
          guarantorID1: 1,
          guarantorID2: 1,
          guarantorID3: 1,
          loanStatus: 1,
          loanInstallmentsHistory: 1,
          interestRate: 1,
          installmentTime: 1,
          noOfInstallments: 1,
          loanStartedDate: 1,
          nextInstallmentDate: 1,
          nextInstallmentAmount: 1,
          approvedBy: {
            $arrayElemAt: ["$approvedByDetails.firstName", 0],
          },
          rejectedBy: {
            $arrayElemAt: ["$rejectedByDetails.firstName", 0],
          },
          rejectedReason: 1,
          ongoingBy: {
            $arrayElemAt: ["$ongoingByDetails.firstName", 0],
          },
          completedBy: {
            $arrayElemAt: ["$completedByDetails.firstName", 0],
          },
        },
      },
    ]);
    if (!loan) {
      return Response.json(
        { success: false, message: "Loan not found" },
        { status: 404 },
      );
    }
    return Response.json(
      { success: true, message: "Loan data", Details: loan[0] },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Error getting loan data" },
      { status: 400 },
    );
  }
}
