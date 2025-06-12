import { NextResponse } from "next/server";

// -------------services-----------------
import { connectDB } from "../../../../../lib/db";
import UserModel from "../../../../../models/UserModel";
import { generateToken } from "@/services/auth services/auth-service";
import { comparePassword } from "@/utils/hashUtils";
import { log } from "console";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  

  //   --------- connect to database -----------
  await connectDB();

  try {
    const user = await UserModel.findOne({ email });
    log("User found", user);

    if (!user || !(await comparePassword(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 401 },
      );
    }
    const token = generateToken(user.ID.toString());
    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    console.log("Error creating user group", error);

    return NextResponse.json({ error: "Error login user" }, { status: 500 });
  }
}
