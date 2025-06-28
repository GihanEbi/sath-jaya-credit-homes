// -------------services-----------------
import { CheckUserAccess } from "@/services/auth services/auth-service";
import { connectDB } from "../../../../../lib/db";
import CreditUserModel from "../../../../../models/CreditUserModel";

type isValidTokenTypes = {
  success: boolean;
  message: string;
  status?: number;
  // Optional userId if needed for further processing
  userId?: string;
};

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const userID = searchParams.get("userID");

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
    const creditUser = await CreditUserModel.find({
      ID: userID,
    });
    if (!creditUser) {
      return Response.json(
        { success: false, message: "Credit user not found" },
        { status: 404 },
      );
    }

    return Response.json(
      { success: true, message: "Credit users data", Details: creditUser[0] },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Error getting credit user data" },
      { status: 400 },
    );
  }
}
