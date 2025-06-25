import jwt from "jsonwebtoken";
import { config } from "@/config";
import UserModel from "../../../models/UserModel";

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwtSecret);
};

export const CheckUserAccess = (tokenString: string | null) => {
  if (!tokenString) {
    return { success: false, message: "Token is required", status: 401 };
  } else {
    // Validate the token
    let isValidToken: any;
    try {
      isValidToken = verifyToken(tokenString);

      if (!isValidToken) {
        return { success: false, message: "Invalid token", status: 401 };
      }
    } catch (error) {
      return { success: false, message: "Invalid token", status: 401 };
    }

    // check if the user in user table
    // after development it should be check the user have correct access to this action
    const user = UserModel.find({ ID: isValidToken.userId });
    if (!user) {
      return { success: false, message: "User not found", status: 404 };
    } else {
      return {
        success: true,
        message: "User access verified",
        userId: isValidToken.userId,
      };
    }
  }
};
