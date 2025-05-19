import mongoose, { Schema, Document } from "mongoose";

export interface IdGenerator extends Document {
  code: string;
  seq: Number;
}

const IdGeneratorSchema = new Schema<IdGenerator>({
  code: { type: String, required: true },
  seq: { type: Number, required: true },
});

const IdGeneratorModel =
  mongoose.models.id_generators ||
  mongoose.model<IdGenerator>("id_generators", IdGeneratorSchema);
export default IdGeneratorModel;
