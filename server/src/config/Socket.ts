import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

interface ChatUser { _id: string; }
interface MessagePayload {
  sender: ChatUser;
  chat: { users: ChatUser[]; };
  content: string;
  // …any other fields you store
}

export default function setupSocket(server: HttpServer) {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`🟢 Socket connected: ${socket.id}`);

    // 1️⃣ Personal “setup” room
    socket.on("setup", (userId: string) => {
      socket.join(userId);
      console.log(`– User ${userId} joined personal room`);
      socket.emit("connected");
    });

    // 2️⃣ Join a particular chat room
    socket.on("joinChat", (roomId: string) => {
      socket.join(roomId);
      console.log(`– ${socket.id} joined chat room: ${roomId}`);
    });

    // 3️⃣ Typing indicators
    socket.on("typing", (roomId: string) => {
      socket.to(roomId).emit("typing");
    });
    socket.on("stopTyping", (roomId: string) => {
      socket.to(roomId).emit("stopTyping");
    });

    // 4️⃣ New message broadcast
    socket.on("newMessage", (msg: MessagePayload) => {
      const { chat, sender } = msg;
      if (!chat?.users) {
        console.warn("⚠️ chat.users not defined");
        return;
      }
      chat.users.forEach((user) => {
        if (user._id === sender._id) return;            // skip sender
        socket.to(user._id).emit("messageReceived", msg);
      });
    });

    // 5️⃣ Cleanup
    socket.on("disconnect", () => {
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
  });
}
