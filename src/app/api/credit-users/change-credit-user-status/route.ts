import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { CheckUserAccess } from "@/services/auth services/auth-service";
import CreditUserModel from "../../../../../models/CreditUserModel";
import { access_levels } from "@/constants/access_constants";

type isValidTokenTypes = {
  success: boolean;
  access: string;
  status?: number;
  // Optional userId if needed for further processing
  userId?: string;
};

export async function POST(req: Request) {
  const { creditUserID, newStatus } = await req.json();
    
      // ----------- check if the token provided in headers -----------
      const tokenString = req.headers.get('token');
      if (!tokenString) {
        return NextResponse.json(
          { success: false, message: 'Token is required' },
          { status: 401 }
        );
      }
      const checkResult = await CheckUserAccess(
        tokenString,
        access_levels.ChangeCreditUserStatus
      );
      const isValidToken: isValidTokenTypes = {
        success: checkResult.success,
        access: checkResult.access ?? '',
        userId: checkResult.userId,
      };
    
      if (!isValidToken.success) {
        return NextResponse.json(
          { success: isValidToken.success, message: 'Unauthorized' },
          { status: 403 }
        );
      }

  //   --------- connect to database -----------
  await connectDB();

  // ------------ Check if user exists -----------
  const user = await CreditUserModel.findOne({ ID: creditUserID });
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "User not found",
      },
      { status: 404 },
    );
  }

  try {
    // ------------ Update user status -----------
    user.isActive = newStatus;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "User status updated successfully",
        data: user,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error updating user status" },
      { status: 500 },
    );
  }
}
