// -------------services-----------------
import { CheckUserAccess } from "@/services/auth services/auth-service";
import { connectDB } from "../../../../../../lib/db";
import CreditUserModel from "../../../../../../models/CreditUserModel";
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

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const userGroupID = searchParams.get("userGroupID");

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
    const checkCreditUserGroup = await CreditUserGroupModel.find({
      ID: userGroupID,
    });
    if (!checkCreditUserGroup || checkCreditUserGroup.length === 0) {
      return Response.json(
        { success: false, message: "Credit user group not found" },
        { status: 404 },
      );
    }
    const creditUserGroups = await CreditUserGroupModel.aggregate([
      {
        $match: { ID: userGroupID },
      },
      {
        $lookup: {
          from: "credit_users",
          localField: "leaderID",
          foreignField: "ID",
          as: "leaderDetails",
        },
      },

      // STAGE 8: Look up the details for all members in the 'memberIDs' array.
      {
        $lookup: {
          from: "credit_users",
          localField: "memberIDs",
          foreignField: "ID",
          as: "memberDetails",
        },
      },
      {
        $project: {
          _id: 0, // Exclude the default _id
          groupId: "$ID",
          isActive: "$isActive",
          leader: {
            // Take the first element from the leaderDetails array.
            // Use $ifNull to prevent errors if leader is not found.
            $arrayElemAt: [
              {
                $ifNull: ["$leaderDetails", []],
              },
              0,
            ],
          },
          members: "$memberDetails", // The full array of member documents
        },
      },
      {
        $project: {
          groupId: 1,
          isActive: 1,
          leader: {
            // Reshape the leader object
            ID: "$leader.ID",
            fullName: "$leader.fullName",
            phoneNo: "$leader.phoneNo",
            profilePicture: "$leader.profilePicture",
          },
          members: {
            // Use $map to reshape each object in the members array
            $map: {
              input: "$members",
              as: "member",
              in: {
                ID: "$$member.ID",
                fullName: "$$member.fullName",
                phoneNo: "$$member.phoneNo",
                profilePicture: "$$member.profilePicture",
              },
            },
          },
        },
      },
    ]);
    return Response.json(
      {
        success: true,
        message: "Credit user groups data",
        Details: creditUserGroups[0] || {},
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Error getting credit user groups data" },
      { status: 400 },
    );
  }
}
