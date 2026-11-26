import { Schema, model, models, type Model } from "mongoose";
import { toJSONOptions } from "@/models/shared";

export interface IMessage {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service?: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, default: "" },
    service: { type: String, default: "" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, toJSON: toJSONOptions },
);

export const Message: Model<IMessage> =
  (models.Message as Model<IMessage>) ?? model<IMessage>("Message", MessageSchema);
