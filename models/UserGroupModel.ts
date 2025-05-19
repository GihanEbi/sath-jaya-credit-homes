import mongoose, { Schema, Document } from "mongoose";

export interface IUserGroup extends Document {
  ID: string;
  groupName: string;
  description: string;
  isActive?: boolean;

  //   created user details
  userCreated?: string;
  userModified?: string;
}

const userGroupSchema = new Schema<IUserGroup>(
  {
    ID: { type: String, required: true, unique: true },
    groupName: { type: String, required: true },
    description: { type: String, required: false },
    isActive: { type: Boolean, default: true },

    //   created user details
    userCreated: { type: String, required: false },
    userModified: { type: String, required: false },
  },
  { timestamps: true },
);

export default mongoose.models.UserGroup ||
  mongoose.model("UserGroup", userGroupSchema);
