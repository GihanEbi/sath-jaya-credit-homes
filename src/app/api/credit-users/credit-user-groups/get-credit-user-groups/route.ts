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

export async function POST(req: Request) {
  // --------- search value ----------
  const { searchValue } = await req.json();
  //   --------- pagination values ----------
  const { searchParams } = new URL(req.url);
  const pageNo = Number(searchParams.get("pageNo"));
  const pageSize = Number(searchParams.get("pageSize"));

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

  // ------------ pagination values -----------
  let skip = 0;
  let limit = 0;
  if (pageNo && pageSize) {
    skip = (pageNo - 1) * pageSize;
    limit = pageSize;
  }

  try {
    const creditUserGroups = await CreditUserGroupModel.aggregate([
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
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            {
              $sort: {
                createdAt: -1 as -1 | 1, // or 1 for ascending
              },
            },
            { $skip: skip },
            { $limit: limit },
          ],
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

    //  --------- return when pagination values are provided ---------
    if (pageNo && pageSize) {
      let response = {
        details: creditUserGroups[0].data,
        noOfPages: Math.ceil(
          creditUserGroups[0].metadata.length !== 0
            ? creditUserGroups[0].metadata[0].total / pageSize
            : 0,
        ),
        noOfRecords:
          creditUserGroups[0].metadata.length !== 0
            ? creditUserGroups[0].metadata[0].total
            : 0,
      };
      return Response.json(
        {
          success: true,
          message: "Credit user groups data",
          response,
        },
        { status: 200 },
      );
    } else {
      //  --------- return when pagination values are not provided ---------
      return Response.json(
        {
          success: true,
          message: "Credit user groups data",
          Details: creditUserGroups,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    return Response.json(
      { success: false, message: "Error getting credit user groups data" },
      { status: 400 },
    );
  }
}
