import mongoose, { Schema, Document } from "mongoose";

export interface ICreditUserGroup extends Document {
  ID: string;
  leaderID: string;
  memberIDs: string[];
  isActive?: boolean;
}

const CreditUserGroupSchema: Schema = new Schema(
  {
    ID: { type: String, required: true, unique: true },
    leaderID: { type: String, required: true, unique: true },
    memberIDs: { type: [String], required: true },
    isActive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.credit_user_groups ||
  mongoose.model("credit_user_groups", CreditUserGroupSchema);
