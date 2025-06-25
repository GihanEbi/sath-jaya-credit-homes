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
