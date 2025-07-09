// -------------services-----------------
import { CheckUserAccess } from "@/services/auth services/auth-service";
import { connectDB } from "../../../../../../lib/db";
import CreditUserGroupModel from "../../../../../../models/CreditUserGroupModel";
import { NextResponse } from "next/server";
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
  const tokenString = req.headers.get("token");
  if (!tokenString) {
    return NextResponse.json(
      { success: false, message: "Token is required" },
      { status: 401 },
    );
  }
  const checkResult = await CheckUserAccess(
    tokenString,
    access_levels.GetCreditUserGroups,
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
    const creditUserGroups = await CreditUserGroupModel.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $project: {
          _id: 0,
          label: "$ID",
          value: "$ID",
        },
      },
    ]);

    if (!creditUserGroups) {
      return Response.json(
        {
          success: false,
          message: "Credit user groups not Found",
        },
        { status: 404 },
      );
    }

    //  --------- return creditUserGroups ---------
    return Response.json(
      { success: true, message: "User groups data", Details: creditUserGroups },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Error getting credit user groups data" },
      { status: 400 },
    );
  }
}
