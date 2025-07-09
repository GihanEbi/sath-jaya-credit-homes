import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/db";
import { CheckUserAccess } from "@/services/auth services/auth-service";
import CreditUserModel from "../../../../../../models/CreditUserModel";
import CreditUserGroupModel from "../../../../../../models/CreditUserGroupModel";
import { access_levels } from "@/constants/access_constants";

type isValidTokenTypes = {
  success: boolean;
  access: string;
  status?: number;
  // Optional userId if needed for further processing
  userId?: string;
};

export async function POST(req: Request) {
  const { creditUserGroupID, isActive } = await req.json();

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
    access_levels.ChangeCreditUserGroupStatus,
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

  //   ------------ Check if the credit user group exists -----------
  const creditUserGroup = await CreditUserGroupModel.findOne({
    ID: creditUserGroupID,
  });
  if (!creditUserGroup) {
    return NextResponse.json(
      {
        success: false,
        message: "Credit user group not found",
      },
      { status: 404 },
    );
  }

  //   ------------ Update the credit user group status -----------
  try {
    creditUserGroup.isActive = isActive;
    await creditUserGroup.save();

    return NextResponse.json(
      {
        success: true,
        message: "Credit user group status updated successfully",
        data: creditUserGroup,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error updating credit user group status" },
      { status: 500 },
    );
  }
}
