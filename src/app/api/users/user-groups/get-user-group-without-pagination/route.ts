import { NextResponse } from "next/server";

// -------------services-----------------
import { connectDB } from "../../../../../../lib/db";
import UserGroupModel from "../../../../../../models/UserGroupModel";

export async function GET(req: Request) {
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
