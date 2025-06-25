import mongoose, { Schema, Document } from "mongoose";

export interface CreditUserType extends Document {
  ID: string;
  fullName: string;
  gender: string;
  birthday: string;
  permanentAddress: string;
  phoneNo: string;
  address: string;
  nic: string;
  maritalState: string;
  email?: string;
  profilePicture?: string;
  nicFrontPicture?: string;
  nicBackPicture?: string;
  locationCertificationPicture?: string;
  isActive?: boolean;
  userGroupId?: string;
}

const creditUserSchema = new Schema<CreditUserType>(
  {
    ID: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    gender: { type: String, required: true },
    birthday: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    phoneNo: { type: String, required: true },
    address: { type: String, required: true },
    nic: { type: String, required: true, unique: true },
    maritalState: { type: String, required: true },
    email: { type: String, required: false },
    profilePicture: { type: String, required: false },
    nicFrontPicture: { type: String, required: false },
    nicBackPicture: { type: String, required: false },
    locationCertificationPicture: { type: String, required: false },
    isActive: { type: Boolean, default: false },
    userGroupId: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.credit_users ||
  mongoose.model("credit_users", creditUserSchema);
