import mongoose, { model, models, Schema, Types } from "mongoose";
interface Imessage extends Document {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  chats: Types.ObjectId;
  readedBy: [Types.ObjectId];
}
const messageSchema = new Schema<Imessage>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, unique: true, required: true },
  chats: { type: Schema.Types.ObjectId, ref: "Chat", required: true },

  readedBy: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
},{timestamps:true});

const Message = models?.Message || model<Imessage>("Message", messageSchema);
