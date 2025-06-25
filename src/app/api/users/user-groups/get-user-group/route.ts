// -------------services-----------------
import { CheckUserAccess } from "@/services/auth services/auth-service";
import { connectDB } from "../../../../../../lib/db";
import UserGroupModel from "../../../../../../models/UserGroupModel";
import page from "@/app/login/page";

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

  console.log("Search Value:", pageNo, pageSize, searchValue);
  

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
    const userGroups = await UserGroupModel.aggregate([
      // -------- search value ------
      {
        $match: {
          $and: [
            searchValue !== ""
              ? {
                  $or: [
                    {
                      groupName: {
                        $regex: new RegExp(searchValue, "i"),
                      },
                    },
                  ],
                }
              : {},
          ],
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

    if (!userGroups) {
      return Response.json(
        {
          success: false,
          message: "User groups not Found",
        },
        { status: 404 },
      );
    }
    //  --------- return when pagination values are provided ---------
    if (pageNo && pageSize) {
      let response = {
        details: userGroups[0].data,
        noOfPages: Math.ceil(
          userGroups[0].metadata.length !== 0
            ? userGroups[0].metadata[0].total / pageSize
            : 0,
        ),
        noOfRecords:
          userGroups[0].metadata.length !== 0
            ? userGroups[0].metadata[0].total
            : 0,
      };
      return Response.json(
        {
          success: true,
          message: "User groups data",
          response,
        },
        { status: 200 },
      );
    } else {
      //  --------- return when pagination values are not provided ---------
      return Response.json(
        { success: true, message: "User groups data", Details: userGroups },
        { status: 200 },
      );
    }
  } catch (error) {
    return Response.json(
      { success: false, message: "Error getting user groups data" },
      { status: 400 },
    );
  }
}
