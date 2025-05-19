import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  ID: string;
  firstName: string;
  lastName: string;
  birthday: string;
  email: string;
  phoneNo: string;
  address: string;
  password: string;
  isActive?: boolean;
}

const userSchema = new Schema<IUser>(
  {
    ID: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthday: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phoneNo: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
