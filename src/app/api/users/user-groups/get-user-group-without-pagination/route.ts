// -------------services-----------------
import { connectDB } from "../../../../../../lib/db";
import UserGroupModel from "../../../../../../models/UserGroupModel";
import { CheckUserAccess } from "@/services/auth services/auth-service";

type isValidTokenTypes = {
  success: boolean;
  message: string;
  status?: number;
  // Optional userId if needed for further processing
  userId?: string;
};

export async function GET(req: Request) {
  // ----------- check if the token provided in headers -----------
  const tokenString = req.headers.get("token");
  const isValidToken: isValidTokenTypes = CheckUserAccess(tokenString);

  if (!isValidToken.success) {
    return Response.json(
      { success: isValidToken.success, message: isValidToken.message },
      { status: isValidToken.status },
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
