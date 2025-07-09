import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/db";
import { CheckUserAccess } from "@/services/auth services/auth-service";
import CreditUserGroupModel from "../../../../../../models/CreditUserGroupModel";
import CreditUserModel from "../../../../../../models/CreditUserModel";
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
  const creditUserGroupID = searchParams.get("creditUserGroupID");
  const { leaderID, memberIDs } = await req.json();

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
    access_levels.EditCreditUserGroup,
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

  // ------------ Check if leaderID and memberIDs are provided -----------
  if (!leaderID || !memberIDs || memberIDs.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Leader ID and member IDs are required",
      },
      { status: 400 },
    );
  }

  // check if the creditUserGroupID is in loans collection as a teamID
  const isInLoansCollection = await CreditUserGroupModel.findOne({
    teamID: creditUserGroupID,
  });
  if (isInLoansCollection) {
    return NextResponse.json(
      {
        success: false,
        message: "Cannot edit. One or more members have loan in this group",
      },
      { status: 400 },
    );
  }
  // ------------ Check if leader exists -----------
  const leader = await CreditUserModel.find({ ID: leaderID });
  if (!leader) {
    return NextResponse.json(
      {
        success: false,
        message: "Leader not found",
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
  //   ------------ check if the leaderId is already as a group leader exists not creditUserGroupID -----------
  const existingGroup = await CreditUserGroupModel.findOne({
    leaderID: leaderID,
    ID: { $ne: creditUserGroupID },
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
  //   ------------ check if the memberIDs are already in a group -----------
  const existingMembersInGroup = await CreditUserGroupModel.find({
    memberIDs: { $in: memberIDs },
    ID: { $ne: creditUserGroupID },
  });
  if (existingMembersInGroup.length > 0) {
    return NextResponse.json(
      {
        success: false,
        message: "One or more members are already in a group",
      },
      { status: 409 },
    );
  }

  //   ------------ check if the leaderId is in a memberIds array in any collection in database -----------
  const isLeaderInMembers = memberIDs.includes(leaderID);
  if (isLeaderInMembers) {
    return NextResponse.json(
      {
        success: false,
        message: "Leader ID cannot be a member of the group",
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

  // ------------ check if member is a leader of any other collection -------
  const isMemberLeaderInOtherGroups = await CreditUserGroupModel.findOne({
    leaderID: { $in: memberIDs },
  });
  if (isMemberLeaderInOtherGroups) {
    return NextResponse.json(
      {
        success: false,
        message: "One or more members are already leaders of other groups",
      },
      { status: 409 },
    );
  }

  //   ---- edit credit user group details ----
  let updatedCreditUserGroup;
  try {
    updatedCreditUserGroup = await CreditUserGroupModel.findOneAndUpdate(
      { ID: creditUserGroupID },
      {
        leaderID,
        memberIDs,
      },
      { new: true },
    );

    return NextResponse.json({
      success: true,
      message: "User group details updated successfully",
      data: updatedCreditUserGroup,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error updating user group details" },
      { status: 500 },
    );
  }
}
