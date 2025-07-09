import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { CheckUserAccess } from "@/services/auth services/auth-service";
import CreditUserModel from "../../../../../models/CreditUserModel";
import LoanModel from "../../../../../models/LoanModel";
import { createId } from "@/services/id_generator/id-generator-service";
import { id_codes } from "@/constants/id_code_constants";
import CreditUserGroupModel from "../../../../../models/CreditUserGroupModel";
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
  const checkResult = await CheckUserAccess(tokenString, access_levels.AddLoan);
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

  //   ------------ check if guarantorId2 exists -----------
  const guarantor2 = await CreditUserModel.findOne({ ID: guarantorID2 });
  if (!guarantor2) {
    return NextResponse.json(
      { success: false, message: "Guarantor 2 not found" },
      { status: 404 },
    );
  }
  //   ------------ check if guarantorId2 isActive -----------
  if (!guarantor2.isActive) {
    return NextResponse.json(
      { success: false, message: "Guarantor 2 is not active" },
      { status: 403 },
    );
  }
  //   ------------ check if guarantorId2 userGroupID is same to team id  -----------
  if (guarantor2.userGroupId !== teamID) {
    return NextResponse.json(
      { success: false, message: "Guarantor 2 is not in the same team" },
      { status: 403 },
    );
  }
  //   ------------ check if guarantorId3 exists -----------
  if (guarantorID3 !== "") {
    const guarantor3 = await CreditUserModel.findOne({ ID: guarantorID3 });
    if (!guarantor3) {
      return NextResponse.json(
        { success: false, message: "Guarantor 3 not found" },
        { status: 404 },
      );
    }
    //   ------------ check if guarantorId3 isActive -----------
    if (!guarantor3.isActive) {
      return NextResponse.json(
        { success: false, message: "Guarantor 3 is not active" },
        { status: 403 },
      );
    }

    //   ------------ check if guarantorId3 userGroupID is same to team id  -----------
    if (guarantor3.userGroupId !== teamID) {
      return NextResponse.json(
        { success: false, message: "Guarantor 3 is not in the same team" },
        { status: 403 },
      );
    }
  }

  //   ------------ check if the applicant already has a loan in this collection -----------
  const existingLoan = await LoanModel.find({
    applicantID: applicantID,
    loanStatus: { $ne: loanConstants.status.completed },
  });
  if (existingLoan.length > 0) {
    return NextResponse.json(
      { success: false, message: "Applicant already has a loan" },
      { status: 400 },
    );
  }
  //   ------------ create a new loan -----------
  let newLoan;
  try {
    // --------- unique ID generator ---------
    let loanId = await createId(id_codes.idCode.loan);

    // --------- create loan object ---------
    newLoan = new LoanModel({
      ID: loanId,
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
      guarantorID3: guarantorID3 || null, // Allow guarantorID3 to be optional
      loanStatus: loanConstants.status.pending, // Default status is pending
    });
    // --------- save loan object to database ---------
    await newLoan.save();
    return NextResponse.json(
      {
        success: true,
        message: "Loan created successfully",
        data: newLoan,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error creating loan" },
      { status: 500 },
    );
  }
}
