import { Request, Response } from "express";
import Chat from "../models/Chat.model";
import User from "../models/User.model";
interface AuhtRequest extends Request {
  userInfo?: any;
}
const createChat = async (req: AuhtRequest, res: Response): Promise<void> => {
  const senderId = req.userInfo._id;
  const { receiverId } = req.body;
  
  
  if (!receiverId) {
    res
      .status(400)
      .json({ success: false, message: "Reciver Required For chat" });
      return
  }
  
  
  
  try {
     
    const existingChat = await Chat.findOne({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: senderId } } },
        { users: { $elemMatch: { $eq: receiverId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (existingChat) {
      const populatedChat = await Chat.populate(existingChat, {
        path: "latestMessage.sender",
        select: "name avatar phone",
      });
      
      

      res.status(200).json({ success: true, chat: populatedChat });
      return;
    }

    
    const chatData = {
      chatname:"sender",
      isGroupChat: false,
      users: [senderId, receiverId],
    };
    console.log(chatData);
    

    const newChat = await Chat.create(chatData);
    
    
    const fullChat = await Chat.findById(newChat._id).populate("users", "-password");

    res.status(200).json({ success: true, message: "Chat created", chat: fullChat,senderId });

  } catch (error) {
    console.error("Error in createChat:", error);
    res.status(500).json({ success: false, message: "Server error in creating chat" });
  }
};

const getChat = async (req: AuhtRequest, res: Response): Promise<void> => {
  try {
    const senderId = req.userInfo._id;

    const chats = await Chat.find({
      users: { $elemMatch: { $eq: senderId } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .lean(); // Important: so we can mutate objects

    const fullChat = await Chat.populate(chats, {
      path: "latestMessage.sender",
      select: "username phone avatar",
    });

    // 👇 Inject receiverInfo in non-group chats
    fullChat.forEach((chat: any) => {
      if (!chat.isGroupChat) {
        const receiver = chat.users.find(
          (user: any) => user._id.toString() !== senderId.toString()
        );
        chat.receiverInfo = receiver;
      }
    });

    res.status(200).json({
      success: true,
      message: "Fetched all messages",
      fullChat,
      id: senderId,
    });
  } catch (error) {
    console.log("getChat error", error);
    res.status(500).json({ success: false, message: "Error in getchat" });
  }
};


const CreateGroup = async (req: AuhtRequest, res: Response): Promise<void> => {
  const users = req.body.users;
  const groupname = req.body.groupname;
  const user = req.userInfo;
  if (!users || !user) {
    res.status(400).json({ success: false, message: "no inputs" });
  }
  let usersdata;
  try {
    usersdata = JSON.parse(users);
  } catch (error) {
    console.log("Json Paers error", error);
  }
  if (usersdata < 2) {
    res
      .status(400)
      .json({
        success: false,
        message: "2 or more users needed for groupchat",
      });
    return;
  }

  usersdata.push(user);

  try {
    const group = await Chat.create({
      chatname: groupname,
      isGroupChat: true,
      users: usersdata,
      groupAdmin: user,
    });
    const groupchat = await Chat.findById(group._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res
      .status(200)
      .json({ success: true, message: "Fetched group chat", groupchat });
  } catch (error) {
    res.status(500).json({ success: false, message: "CreateGroup error" });
  }
};
const ChangeGroupName = async (
  req: AuhtRequest,
  res: Response
): Promise<void> => {
  try {
    const { groupId, newName } = req.body;
    const groupNameChange = await Chat.findById(
      groupId,
      { chatname: newName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!groupNameChange) {
      res.status(400).json({ success: false, message: "Group not matched" });
      return;
    }
    res.status(200).json({ success: true, message: "Group Name Updated" });
    return;
  } catch (error) {
    console.log("change group error", error);

    res.status(400).json({ success: false, message: "Erro in chage group" });
  }
};
const RemoveFromChatGroup = async (
  req: AuhtRequest,
  res: Response
): Promise<void> => {
  try {
    const { groupId, UserId } = req.body;
    const removeUser = await Chat.findByIdAndUpdate(
      groupId,
      { $pull: { users: UserId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!removeUser) {
      res.status(400).json({ success: false, message: "User not matched" });
      return;
    }
    res.status(200).json({ success: true, message: "removed from the group" });
    return;
  } catch (error) {
    console.log("remove group error", error);

    res.status(400).json({ success: false, message: "Erro in chage group" });
  }
};
const AddToChatGroup = async (
  req: AuhtRequest,
  res: Response
): Promise<void> => {
  try {
    const { groupId, userId } = req.body;
    const addToGroup = await Chat.findByIdAndUpdate(
      groupId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!addToGroup) {
      res.status(400).json({ success: false, message: "User not matched" });
      return;
    }
    res.status(200).json({ success: true, message: "User add to the group" });
    return;
  } catch (error) {
    console.log("add group error", error);

    res.status(400).json({ success: false, message: "Erro in chage group" });
  }
};

export {
  createChat,
  getChat,
  CreateGroup,
  ChangeGroupName,
  RemoveFromChatGroup,
  AddToChatGroup,
};
