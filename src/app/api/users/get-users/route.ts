// -------------services-----------------
import { CheckUserAccess } from "@/services/auth services/auth-service";
import { connectDB } from "../../../../../lib/db";
import UserModel from "../../../../../models/UserModel";

type isValidTokenTypes = {
  success: boolean;
  message: string;
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
  const isValidToken: isValidTokenTypes = CheckUserAccess(tokenString);

  if (!isValidToken.success) {
    return Response.json(
      { success: isValidToken.success, message: isValidToken.message },
      { status: isValidToken.status },
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
    const users = await UserModel.aggregate([
      // -------- search value ------
      {
        $match: {
          ...(searchValue !== "" && {
            $or: [
              {
                firstName: {
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
                createdAt:  -1 as -1 | 1, // or 1 for ascending
              },
            },
            { $skip: skip },
            { $limit: limit },
          ],
        },
      },
    ]);

    if (!users) {
      return Response.json(
        {
          success: false,
          message: "Users not Found",
        },
        { status: 404 },
      );
    }

    //  --------- return when pagination values are provided ---------
    if (pageNo && pageSize) {
      let response = {
        details: users[0].data,
        noOfPages: Math.ceil(
          users[0].metadata.length !== 0
            ? users[0].metadata[0].total / pageSize
            : 0,
        ),
        noOfRecords:
          users[0].metadata.length !== 0 ? users[0].metadata[0].total : 0,
      };
      return Response.json(
        {
          success: true,
          message: "Users data",
          response,
        },
        { status: 200 },
      );
    } else {
      //  --------- return when pagination values are not provided ---------
      return Response.json(
        { success: true, message: "Users data", Details: users },
        { status: 200 },
      );
    }
  } catch (error) {
    return Response.json(
      { success: false, message: "Error getting users data" },
      { status: 400 },
    );
  }
}
