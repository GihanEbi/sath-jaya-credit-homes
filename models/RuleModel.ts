import mongoose, { Schema, Document } from 'mongoose';

export interface IRule extends Document {
  ID: string;
  name: string;
  description: string;

  //   created user details
  userCreated?: string;
  userModified?: string;
}
const ruleSchema = new Schema<IRule>(
  {
    ID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },

    //   created user details
    userCreated: { type: String, required: false },
    userModified: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.rules ||
  mongoose.model<IRule>('rules', ruleSchema);
