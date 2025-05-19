import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import User from "../../../../../models/User";
import bcrypt from "bcrypt";
import { hashPassword } from "@/utils/hashUtils";
import { config } from "@/config";
import { createId } from "@/services/id_generator/id-generator-service";
import { id_codes } from "@/constants/id_code_constants";

export async function POST(req: Request) {
  const {
    firstName,
    lastName,
    birthday,
    email,
    phoneNo,
    address,
    userGroupId,
  } = await req.json();

//   --------- connect to database -----------
  await connectDB();

  // ------------ Check if user already exists -----------
  const existingUser = await User.find({
    $or: [{ email }, { phoneNo }],
  });
  if (existingUser.length > 0) {
    return NextResponse.json(
      { error: "User email or phone no already exists" },
      { status: 409 },
    );
  }

  // ----------- random password generator -----------
  let result = "";
  const length = 2;
  const capitalLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const simpleLetters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialCharacters = "$%@";

  for (let i = 0; i < length; i++) {
    result += capitalLetters.charAt(
      Math.floor(Math.random() * capitalLetters.length),
    );
    result += simpleLetters.charAt(
      Math.floor(Math.random() * simpleLetters.length),
    );
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    result += specialCharacters.charAt(
      Math.floor(Math.random() * specialCharacters.length),
    );
  }

  // ----------- create created user details -----------
  let createdUser;
  const date = new Date(Date() + "UTC");
  // let userCreated = userID;
  let dateCreated = date;

  try {
    // --------- unique ID generator ---------
    let userId = await createId(id_codes.idCode.user);
    // --------- generate random password ---------
    const generatedPassword = result;
    const hashedPassword = await hashPassword(generatedPassword);

    // --------- create user object ---------
     createdUser = new User({
      ID: userId,
      firstName,
      lastName,
      birthday,
      email,
      phoneNo,
      address,
      password: hashedPassword,
      isActive: true,
      userGroupId,
      dateCreated
    });
    await createdUser.save();

    // try {
    //   const msg = {
    //     to: email,
    //     from: config.emailConfig.email_sender_domain_email,
    //     subject: "Welcome to Bid Management – Your Account Credentials",
    //     text: `Hello ${firstName},

    //   Welcome to Bid Management!

    //   Your account has been successfully created. Below are your login credentials:

    //   Email: ${email}
    //   Password: ${generatedPassword}

    //   For security reasons, please change your password after logging in for the first time.

    //   If you have any questions or need assistance, feel free to reach out.

    //   Best regards,
    //   Bid Management Team`,

    //     html: `
    //     <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
    //       <div style="max-width: 600px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); margin: auto;">
    //         <h2 style="color: #007bff; text-align: center;">Welcome to Bid Management!</h2>
    //         <p>Hello <strong>${firstName}</strong>,</p>
    //         <p>Your account has been successfully created. Below are your login credentials:</p>
    //         <div style="background: #f4f4f4; padding: 10px; border-radius: 5px; font-size: 16px;">
    //           <p><strong>Email:</strong> ${email}</p>
    //           <p><strong>Password:</strong> ${generatedPassword}</p>
    //         </div>
    //         <p style="color: red;"><strong>Important:</strong> Please change your password after logging in for the first time.</p>
    //         <p>If you have any questions or need assistance, feel free to reach out.</p>
    //         <hr style="border: none; border-top: 1px solid #ddd;">
    //         <p style="text-align: center; font-size: 14px; color: #777;">Best regards,<br><strong>Bid Management Team</strong></p>
    //       </div>
    //     </div>
    //     `,
    //   };

    //   //   await sgMail.send(msg);
    // } catch (error) {
    //   return NextResponse.json(
    //     { error: "user added successfully but mail not sent" },
    //     { status: 500 },
    //   );
    // }

    return NextResponse.json({ createdUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error adding user" }, { status: 500 });
  }
}
