import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { CheckUserAccess } from "@/services/auth services/auth-service";
import CreditUserModel from "../../../../../models/CreditUserModel";
import CreditUserGroupModel from "../../../../../models/CreditUserGroupModel";
import { loanConstants } from "@/constants/loan_constants";
import LoanModel from "../../../../../models/LoanModel";
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
  const {
    branchName,
    centerName,
    memberNo,
    teamID,
    applicantID,
    purposeOfLoan,
    mainIncomePerson,
    mainIncomePersonPhoneNo,
    mainIncomePersonNic,
    monthlyFamilyIncome,
    relationship,
    loanBefore,
    loanOrganization,
    loanAmount,
    installment,
    balanceLoanAmount,
    homeLocation,
    shearedApplicantFullName,
    shearedApplicantAddress,
    shearedApplicantPhoneNo,
    shearedApplicantNic,
    shearedApplicantBirthday,
    shearedApplicantMaritalStatus,
    guarantorID1,
    guarantorID2,
    guarantorID3,
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
    access_levels.EditLoan,
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
  //   ------------ check if loanID is provided -----------
  if (!loanID) {
    return NextResponse.json(
      { success: false, message: "Loan ID is required" },
      { status: 400 },
    );
  }
  //   ------------ check if loanID exists -----------
  const loan = await LoanModel.findOne({ ID: loanID });
  if (!loan) {
    return NextResponse.json(
      { success: false, message: "Loan not found" },
      { status: 404 },
    );
  }

  //   ------------ check if loan is in pending or reject state -----------
  if (
    loan.loanStatus !== loanConstants.status.pending &&
    loan.loanStatus !== loanConstants.status.rejected
  ) {
    return NextResponse.json(
      { success: false, message: "Loan is not in a state that can be edited" },
      { status: 403 },
    );
  }

  //   ------------ check if teamId exists -----------
  const team = await CreditUserGroupModel.findOne({ ID: teamID });
  if (!team) {
    return NextResponse.json(
      { success: false, message: "Team not found" },
      { status: 404 },
    );
  }

  //   ------------ check if teamId isActive -----------
  if (!team.isActive) {
    return NextResponse.json(
      { success: false, message: "Team is not active" },
      { status: 403 },
    );
  }

  //   ------------ check if applicantId exists -----------
  const applicant = await CreditUserModel.findOne({ ID: applicantID });
  if (!applicant) {
    return NextResponse.json(
      { success: false, message: "Applicant not found" },
      { status: 404 },
    );
  }
  //   ------------ check if applicantId isActive -----------
  if (!applicant.isActive) {
    return NextResponse.json(
      { success: false, message: "Applicant is not active" },
      { status: 403 },
    );
  }

  //   ------------ check if applicantIds groupId is same to team id  -----------
  if (applicant.userGroupId !== teamID) {
    return NextResponse.json(
      { success: false, message: "Applicant is not in the same team" },
      { status: 403 },
    );
  }
  //   ------------ check if guarantorId1 exists -----------
  const guarantor1 = await CreditUserModel.findOne({ ID: guarantorID1 });
  if (!guarantor1) {
    return NextResponse.json(
      { success: false, message: "Guarantor 1 not found" },
      { status: 404 },
    );
  }
  //   ------------ check if guarantorId1 isActive -----------
  if (!guarantor1.isActive) {
    return NextResponse.json(
      { success: false, message: "Guarantor 1 is not active" },
      { status: 403 },
    );
  }
  //   ------------ check if guarantorId1 userGroupID is same to team id  -----------
  if (guarantor1.userGroupId !== teamID) {
    return NextResponse.json(
      { success: false, message: "Guarantor 1 is not in the same team" },
      { status: 403 },
    );
  }

  //   ------------ edit loan details -----------
  let updatedLoan;
  try {
    updatedLoan = await LoanModel.findOneAndUpdate(
      { ID: loanID },
      {
        branchName,
        centerName,
        memberNo,
        teamID,
        applicantID,
        purposeOfLoan,
        mainIncomePerson,
        mainIncomePersonPhoneNo,
        mainIncomePersonNic,
        monthlyFamilyIncome,
        relationship,
        loanBefore,
        loanOrganization,
        loanAmount,
        installment,
        balanceLoanAmount,
        homeLocation,
        shearedApplicantFullName,
        shearedApplicantAddress,
        shearedApplicantPhoneNo,
        shearedApplicantNic,
        shearedApplicantBirthday,
        shearedApplicantMaritalStatus,
        guarantorID1,
        guarantorID2,
        guarantorID3,
        loansStatus: loanConstants.status.pending, // Resetting status to pending
      },
      { new: true },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Loan updated successfully",
        details: updatedLoan,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error updating loan" },
      { status: 400 },
    );
  }
}
