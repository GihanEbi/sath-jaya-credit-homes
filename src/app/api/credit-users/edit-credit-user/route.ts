import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { CheckUserAccess } from "@/services/auth services/auth-service";
import CreditUserModel from "../../../../../models/CreditUserModel";
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
  const creditUserID = searchParams.get("creditUserID");
  const {
    fullName,
    gender,
    birthday,
    permanentAddress,
    phoneNo,
    address,
    nic,
    maritalState,
    email,
    profilePicture,
    nicFrontPicture,
    nicBackPicture,
    locationCertificationPicture,
  } = await req.json();
    
      // ----------- check if the token provided in headers -----------
      const tokenString = req.headers.get('token');
      if (!tokenString) {
        return NextResponse.json(
          { success: false, message: 'Token is required' },
          { status: 401 }
        );
      }
      const checkResult = await CheckUserAccess(
        tokenString,
        access_levels.EditCreditUser
      );
      const isValidToken: isValidTokenTypes = {
        success: checkResult.success,
        access: checkResult.access ?? '',
        userId: checkResult.userId,
      };
    
      if (!isValidToken.success) {
        return NextResponse.json(
          { success: isValidToken.success, message: 'Unauthorized' },
          { status: 403 }
        );
      }

  //   --------- connect to database -----------
  await connectDB();
  // ----------- check if credit user ID is provided -----------
  if (!creditUserID) {
    return NextResponse.json(
      { success: false, message: "Credit user ID is required" },
      { status: 400 },
    );
  }

  // ----------- check if user exists in the database -----------
  const creditUser = await CreditUserModel.findOne({ ID: creditUserID });
  if (!creditUser) {
    return NextResponse.json(
      { success: false, message: "Credit user not found" },
      { status: 404 },
    );
  }

  // ------------ Check if user already exists in other collections -----------
  const existingUser = await CreditUserModel.findOne({
    $or: [{ nic }, { phoneNo }],
    ID: { $ne: creditUserID }, // Exclude the current user being edited
  });

  if (existingUser) {
    return NextResponse.json({
      success: false,
      message: "User NIC or phone no already exists",
      status: 409,
    });
  }

  // ----------- edit user details -----------
  let updatedCreditUser;
  try {
    updatedCreditUser = await CreditUserModel.findOneAndUpdate(
      { ID: creditUserID },
      {
        fullName,
        gender,
        birthday,
        permanentAddress,
        phoneNo,
        address,
        nic,
        maritalState,
        email,
        profilePicture,
        nicFrontPicture,
        nicBackPicture,
        locationCertificationPicture,
      },
      { new: true },
    );

    return NextResponse.json({
      success: true,
      message: "User details updated successfully",
      data: updatedCreditUser,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error updating user details" },
      { status: 500 },
    );
  }
}
