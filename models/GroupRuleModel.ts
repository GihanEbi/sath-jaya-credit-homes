import mongoose, { Schema, Document } from 'mongoose';

export interface IGroupRule extends Document {
  ID: string;
  groupId: string;
  ruleId: string;

  //   created user details
  userCreated?: string;
  userModified?: string;
}
const groupRuleSchema = new Schema<IGroupRule>(
  {
    ID: { type: String, required: true, unique: true },
    groupId: { type: String, required: true },
    ruleId: { type: String, required: true },

    //   created user details
    userCreated: { type: String, required: false },
    userModified: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.group_rules ||
  mongoose.model<IGroupRule>('group_rules', groupRuleSchema);
