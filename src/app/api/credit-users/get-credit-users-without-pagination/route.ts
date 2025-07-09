// -------------services-----------------
import { CheckUserAccess } from "@/services/auth services/auth-service";
import { connectDB } from "../../../../../lib/db";
import CreditUserModel from "../../../../../models/CreditUserModel";
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
    access_levels.GetCreditUsers,
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
    const creditUsers = await CreditUserModel.aggregate([
      {
        $project: {
          _id: 0,
          label: "$fullName",
          value: "$ID",
        },
      },
    ]);

    if (!creditUsers) {
      return Response.json(
        {
          success: false,
          message: "Credit users not Found",
        },
        { status: 404 },
      );
    }

    //  --------- return creditUSers ---------
    return Response.json(
      { success: true, message: "User groups data", Details: creditUsers },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Error getting credit users data" },
      { status: 400 },
    );
  }
}
