import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { createId } from "@/services/id_generator/id-generator-service";
import { id_codes } from "@/constants/id_code_constants";
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
        access_levels.AddCreditUser
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

  // ------------ Check if user already exists -----------
  const existingUser = await CreditUserModel.find({
    $or: [{ nic }, { phoneNo }],
  });

  console.log(existingUser);
  
  if (existingUser.length > 0) {
    return NextResponse.json({
      success: false,
      message: "User NIC or phone no already exists",
      status: 409,
    });
  }

  // ----------- create created user details -----------
  let createdCreditUser;

  try {
    // --------- unique ID generator ---------
    let userId = await createId(id_codes.idCode.creditUser);

    // --------- create user object ---------
    createdCreditUser = new CreditUserModel({
      ID: userId,
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
      isActive:true, // Default to true, can be changed later
    });

    await createdCreditUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "User added successfully",
        data: createdCreditUser,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error adding user:", error);
    
    return NextResponse.json(
      { success: false, message: "Error adding user" },
      { status: 500 },
    );
  }
}
