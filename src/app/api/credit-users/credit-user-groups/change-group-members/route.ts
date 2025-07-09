import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/db";
import { createId } from "@/services/id_generator/id-generator-service";
import { id_codes } from "@/constants/id_code_constants";
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
  const { creditUserGroupID, memberIDs } = await req.json();

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
    access_levels.ChangeGroupMembers,
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
  // ------------ Check if the credit user group exists -----------
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
  // ------------ Check if members exist -----------
  const members = await CreditUserModel.find({ ID: { $in: memberIDs } });
  if (members.length !== memberIDs.length) {
    return NextResponse.json(
      {
        success: false,
        message: "One or more members not found",
      },
      { status: 404 },
    );
  }
  //   ------------ check if the memberIDs already included in any array of memberIDs in other collections in database without this collection -----------
  const isMemberAlreadyInGroup = await CreditUserGroupModel.findOne({
    ID: { $ne: creditUserGroupID },
    memberIDs: { $in: memberIDs },
  });
  if (isMemberAlreadyInGroup) {
    return NextResponse.json(
      {
        success: false,
        message: "One or more members are already in a group",
      },
      { status: 409 },
    );
  }

  // ---------------- edit credit user group ------------
  try {
    creditUserGroup.memberIDs = memberIDs;
    await creditUserGroup.save();

    // update new credit users
    await CreditUserModel.updateMany(
      { ID: { $in: memberIDs } },
      { $set: { userGroupId: creditUserGroup.ID } },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Credit user group members updated successfully",
        data: creditUserGroup,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error updating credit user group members" },
      { status: 500 },
    );
  }
}
