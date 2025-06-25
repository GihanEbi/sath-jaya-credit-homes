import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { CheckUserAccess } from "@/services/auth services/auth-service";
// import multer from "multer";
// import path from "path";

type isValidTokenTypes = {
  success: boolean;
  message: string;
  status?: number;
  // Optional userId if needed for further processing
  userId?: string;
};

// Multer and disk storage are not used in this Next.js API route.
export async function POST(req: Request) {
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

  // Parse multipart form data
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({
      success: false,
      message: "No file uploaded",
      status: 404,
    });
  }

  // Save the file to disk (example: /tmp directory)
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fs = require("fs");
  const path = require("path");
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const fileName = uniqueSuffix + path.extname(file.name);
  const filePath = path.join(process.cwd(), "public", "files", fileName);

  // Ensure the directory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);

  return NextResponse.json(
    {
      success: true,
      message: "File upload successfully",
      data: { filePath: `/files/${fileName}` },
    },
    { status: 201 },
  );
}
