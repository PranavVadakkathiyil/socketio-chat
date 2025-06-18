import mongoose, { model, models, Schema, Types } from "mongoose";
interface Ichat extends Document {
  _id: Types.ObjectId;
  chatname: string;
  isGroupChat: boolean;
  users: [Types.ObjectId];
  latestMessage: Types.ObjectId;
  groupAdmin: Types.ObjectId;
}
const chatSchema = new Schema<Ichat>(
  {
    chatname: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: "Chat", required: true }],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      
    },

    groupAdmin: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = models?.Chat || model<Ichat>("Chat", chatSchema);

export default Chat