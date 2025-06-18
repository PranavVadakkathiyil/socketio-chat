import { Request, Response } from "express";
import Message from "../models/Message.model";
import Chat from "../models/Chat.model";
interface AuhtRequest extends Request {
  userInfo?: any;
}
const GetAllMessages = async (
  req: AuhtRequest,
  res: Response
): Promise<void> => {
  try {
    const chatId  = req.query.chatId;
    console.log(chatId);
    
    const messages = await Message.find({ chats: chatId })
      .populate("sender", "-password")
      .populate("chats");
    if (!messages) {
      res.status(400).json({ success: false, message: "no messages" });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "Fetched Message for chat", messages });
  } catch (error) {
    console.log("Get AlL Message error", error);
    res
      .status(500)
      .json({ success: true, message: "Get all message server error" });
  }
};
const SendMessage = async (req: AuhtRequest, res: Response): Promise<void> => {
  try {
    const { content, chatId } = req.body;
    const sender = req.userInfo;

    if (!content || !chatId) {
      res
        .status(400)
        .json({ success: false, message: "no content and groupId" });
      return;
    }
      const newMessage = await Message.create({
      sender: sender._id,
      content,
      chats: chatId,
    });

    const fullMessage = await Message.findById(newMessage._id)
      .populate("sender", "username avatar phone")
      .populate({
        path: "chats",
        populate: {
          path: "users",
          select: "username avatar phone",
        },
      });

    // Update the chat's latest message
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: fullMessage?._id,
    });
    res.status(200).json({ success: true, message: "message created", fullMessage });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ success: false, message: "error on server send message" });
  }
};

export { GetAllMessages, SendMessage };
