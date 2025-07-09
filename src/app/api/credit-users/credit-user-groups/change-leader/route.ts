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
  const { creditUserGroupID, leaderID } = await req.json();

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
    access_levels.ChangeLeader,
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
  // ------------ Check if leader exists -----------
  const leader = await CreditUserModel.findOne({ ID: leaderID });
  if (!leader) {
    return NextResponse.json(
      {
        success: false,
        message: "Leader not found",
      },
      { status: 404 },
    );
  }
  //   ------------ check if the leaderId is already as a group leader -----------
  const existingGroup = await CreditUserGroupModel.findOne({
    ID: { $ne: creditUserGroupID },
    leaderID,
  });
  if (existingGroup) {
    return NextResponse.json(
      {
        success: false,
        message: "Leader is already a group leader",
      },
      { status: 409 },
    );
  }

  //   ------------ check if the leaderId already included in any array of memberIDs in any collection in database -----------
  const isLeaderAlreadyInGroup = await CreditUserGroupModel.findOne({
    memberIDs: { $in: [leaderID] },
  });
  if (isLeaderAlreadyInGroup) {
    return NextResponse.json(
      {
        success: false,
        message: "Leader ID is already member of a group",
      },
      { status: 409 },
    );
  }

  // ---------------- edit credit user group ------------
  let editedCreditUserGroup;
  try {
    editedCreditUserGroup = await CreditUserGroupModel.findOneAndUpdate(
      { ID: creditUserGroupID },
      { $set: { leaderID } },
      { new: true },
    );

    // ------- update the credit user model ------------

    await CreditUserModel.updateOne(
      { ID: leaderID },
      { $set: { userGroupId: editedCreditUserGroup.ID } },
    );

    return NextResponse.json(
      {
        success: true,
        message: "change leader successfully",
        data: editedCreditUserGroup,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error changing leader" },
      { status: 500 },
    );
  }
}
