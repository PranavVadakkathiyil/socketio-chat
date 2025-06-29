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
    const senderId = req.userInfo._id;
    const chatId = req.query.chatId;

    const messages = await Message.find({ chats: chatId })
      .populate("sender", "-password")
      .populate({
        path: "chats",
        populate: {
          path: "users",
          select: "username avatar phone",
        },
      });

    let users = [];
    let isGroupChat = false;
    let chatname = '';
    let receiver = null;

    if (messages.length > 0) {
      const chat = messages[0].chats;
      users = chat.users;
      isGroupChat = chat.isGroupChat;
      chatname = chat.chatname;
    } else {
      // If no messages, fetch chat manually
      const chat = await Chat.findById(chatId).populate("users", "username avatar phone");

      if (!chat) {
        res.status(404).json({ success: false, message: "Chat not found" });
        return;
      }

      users = chat.users;
      isGroupChat = chat.isGroupChat;
      chatname = chat.chatname;
    }

    if (!isGroupChat) {
      receiver = users.find((u: any) => u._id.toString() !== senderId.toString());
    }
    
    
    res.status(200).json({
      success: true,
      message: "Fetched Message for chat",
      messages,
      reciver: receiver,
      users: isGroupChat ? users : undefined,
      chatname: isGroupChat ? chatname : undefined,
    });
  } catch (error) {
    console.log("Get All Message error", error);
    res.status(500).json({
      success: false,
      message: "Get all message server error",
    });
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
       let receiverInfo = null;
    if (!fullMessage.chats.isGroupChat) {
      receiverInfo = fullMessage.chats.users.find(
        (user: any) => user._id.toString() !== sender._id.toString()
      );
    }

    // Update the chat's latest message
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: fullMessage?._id,
    });
    res.status(200).json({ success: true, message: "message created", fullMessage,receiverInfo });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ success: false, message: "error on server send message" });
  }
};

export { GetAllMessages, SendMessage };
