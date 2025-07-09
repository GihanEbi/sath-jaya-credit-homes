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

  // ------------ pagination values -----------
  let skip = 0;
  let limit = 0;
  if (pageNo && pageSize) {
    skip = (pageNo - 1) * pageSize;
    limit = pageSize;
  }

  try {
    const creditUsers = await CreditUserModel.aggregate([
      // -------- search value ------
      {
        $match: {
          ...(searchValue !== "" && {
            $or: [
              {
                fullName: {
                  $regex: new RegExp(searchValue, "i"),
                },
              },
            ],
          }),
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            {
              $sort: {
                createdAt: -1 as -1 | 1, // or 1 for ascending,
              },
            },
            { $skip: skip },
            { $limit: limit },
          ],
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

    //  --------- return when pagination values are provided ---------
    if (pageNo && pageSize) {
      let response = {
        details: creditUsers[0].data,
        noOfPages: Math.ceil(
          creditUsers[0].metadata.length !== 0
            ? creditUsers[0].metadata[0].total / pageSize
            : 0,
        ),
        noOfRecords:
          creditUsers[0].metadata.length !== 0
            ? creditUsers[0].metadata[0].total
            : 0,
      };
      return Response.json(
        {
          success: true,
          message: "Credit users data",
          response,
        },
        { status: 200 },
      );
    } else {
      //  --------- return when pagination values are not provided ---------
      return Response.json(
        { success: true, message: "Credit users data", Details: creditUsers },
        { status: 200 },
      );
    }
  } catch (error) {
    return Response.json(
      { success: false, message: "Error getting credit users data" },
      { status: 400 },
    );
  }
}
