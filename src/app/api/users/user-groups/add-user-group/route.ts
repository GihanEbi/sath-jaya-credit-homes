import { NextResponse } from "next/server";

// -------------services-----------------
import { connectDB } from "../../../../../../lib/db";
import UserGroupModel from "../../../../../../models/UserGroupModel";
import { createId } from "@/services/id_generator/id-generator-service";
import { id_codes } from "@/constants/id_code_constants";
import { CheckUserAccess } from "@/services/auth services/auth-service";
import { access_levels } from "@/constants/access_constants";

type isValidTokenTypes = {
  success: boolean;
  access: string;
  status?: number;
  // Optional userId if needed for further processing
  userId?: string;
};

export async function POST(req: Request) {
  const { groupName, description } = await req.json();
  
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
      access_levels.AddUserGroup
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

  // ------------ Check if user group already exists -----------
  const existingUserGroup = await UserGroupModel.find({
    groupName,
  });

  if (existingUserGroup.length !== 0) {
    return NextResponse.json({
      success: false,
      message: "User group name already exists",
      status: 409,
    });
  }

  // ----------- create created user details -----------
  let createdUserGroup;
  // let userCreated = userID;

  try {
    const ID = await createId(id_codes.idCode.userGroup);
    createdUserGroup = new UserGroupModel({
      ID,
      groupName,
      description: description,
      isActive: true,
    });

    await createdUserGroup.save();

    return NextResponse.json(
      {
        success: true,
        message: "User group added successfully",
        data: createdUserGroup,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error adding user group" },
      { status: 500 },
    );
  }
}
