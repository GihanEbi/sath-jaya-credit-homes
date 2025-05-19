import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), `.env`) });

export const config = {
  port: process.env.PORT || 5000,
  dbUrl: process.env.DB_URL || "mongodb://localhost:27017/bidManagement",
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "default_secret",
  emailConfig: {
    domain: process.env.EMAIL_DOMAIN || "",
    apiKey: process.env.EMAIL_API_KEY || "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",
    email_sender_domain_email: process.env.EMAIL_SENDER_DOMAIN_EMAIL || "bidmanagement@jithpl.com",
  },
  smsConfig: {
    domainUrl: process.env.SMS_DOMAIN_URL || "",
    username: process.env.SMS_USERNAME || "",
    password: process.env.SMS_PASSWORD || "",
  },
  jwtExpiration: process.env.JWT_EXPIRATION || "100d",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
};
