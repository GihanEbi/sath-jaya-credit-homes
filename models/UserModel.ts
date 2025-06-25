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
  userGroupId: string;

  //   created user details
  userCreated?: string;
  userModified?: string;
  dateCreated?: Date;
  dateModified?: Date;
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
    userGroupId: { type: String, required: true },

    //   created user details
    userCreated: { type: String, required: false },
    userModified: { type: String, required: false },
    dateCreated: { type: Date, required: false },
    dateModified: { type: Date, required: false },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
