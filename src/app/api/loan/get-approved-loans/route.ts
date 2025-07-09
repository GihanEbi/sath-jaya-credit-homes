// -------------services-----------------
import { CheckUserAccess } from "@/services/auth services/auth-service";
import { connectDB } from "../../../../../lib/db";
import LoanModel from "../../../../../models/LoanModel";
import { loanConstants } from "@/constants/loan_constants";
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
    access_levels.GetApprovedLoans,
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
    const loans = await LoanModel.aggregate([
      { $match: { loanStatus: loanConstants.status.approved } },
      {
        $lookup: {
          from: "credit_users",
          localField: "applicantID",
          foreignField: "ID",
          as: "applicantData",
        },
      },
      {
        $project: {
          _id: 0,
          ID: 1,
          applicantID: 1,
          applicantName: { $arrayElemAt: ["$applicantData.fullName", 0] },
          nic: { $arrayElemAt: ["$applicantData.nic", 0] },
          phoneNO: { $arrayElemAt: ["$applicantData.phoneNo", 0] },
          loanAmount: 1,
          teamID: 1,
          loanStatus: 1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            {
              $sort: {
                createdAt: 1,
              },
            },
            { $skip: skip },
            { $limit: limit },
          ],
        },
      },
    ]);

    if (!loans) {
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
        details: loans[0].data,
        noOfPages: Math.ceil(
          loans[0].metadata.length !== 0
            ? loans[0].metadata[0].total / pageSize
            : 0,
        ),
        noOfRecords:
          loans[0].metadata.length !== 0 ? loans[0].metadata[0].total : 0,
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
        { success: true, message: "Loan data", Details: loans },
        { status: 200 },
      );
    }
  } catch (error) {
    return Response.json(
      { success: false, message: "Error getting loan data" },
      { status: 400 },
    );
  }
}
