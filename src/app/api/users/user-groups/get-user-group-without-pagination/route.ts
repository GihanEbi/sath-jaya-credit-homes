// -------------services-----------------
import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/db";
import UserGroupModel from "../../../../../../models/UserGroupModel";
import { CheckUserAccess } from "@/services/auth services/auth-service";
import { access_levels } from "@/constants/access_constants";

type isValidTokenTypes = {
  success: boolean;
  access: string;
  status?: number;
  // Optional userId if needed for further processing
  userId?: string;
};

export async function GET(req: Request) {

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
    access_levels.GetUserGroups
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

  try {
    const userGroups = await UserGroupModel.aggregate([
      {
        $project: {
          _id: 0,
          label: "$groupName",
          value: "$ID",
        },
      },
    ]);

    if (!userGroups) {
      return Response.json(
        {
          success: false,
          message: "User groups not Found",
        },
        { status: 404 },
      );
    }
    //  --------- return userGroups ---------
    return Response.json(
      { success: true, message: "User groups data", Details: userGroups },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Error getting user groups data" },
      { status: 400 },
    );
  }
}
