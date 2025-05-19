import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), `.env`) });

export const config = {
  port: process.env.PORT || 5000,
  dbUrl: process.env.DB_URL || "mongodb://localhost:27017/bidManagement",
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "default_secret",
  jwtExpiration: process.env.JWT_EXPIRATION || "100d",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  // clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
};
