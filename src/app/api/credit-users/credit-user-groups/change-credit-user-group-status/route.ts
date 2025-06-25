import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/db";
import { CheckUserAccess } from "@/services/auth services/auth-service";
import CreditUserModel from "../../../../../../models/CreditUserModel";
import CreditUserGroupModel from "../../../../../../models/CreditUserGroupModel";

type isValidTokenTypes = {
  success: boolean;
  message: string;
  status?: number;
  // Optional userId if needed for further processing
  userId?: string;
};

export async function POST(req: Request) {
  const { creditUserGroupID, isActive } = await req.json();

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

  //   ------------ Check if the credit user group exists -----------
  const creditUserGroup =
    await CreditUserGroupModel.findOne({ ID: creditUserGroupID });
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
