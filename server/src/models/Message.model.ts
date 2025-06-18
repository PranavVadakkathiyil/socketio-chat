import mongoose, { model, models, Schema, Types } from "mongoose";
interface Imessage extends Document {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  chats: Types.ObjectId;
  readedBy: [Types.ObjectId];
}
const messageSchema = new Schema<Imessage>({
  sender: { type: Schema.Types.ObjectId, ref: "User",  },
  content: { type: String, trim: true },
  chats: { type: Schema.Types.ObjectId, ref: "Chat",  },

  readedBy: [{ type: Schema.Types.ObjectId, ref: "User",  }],
},{timestamps:true});

const Message = models?.Message || model<Imessage>("Message", messageSchema);

export default Message