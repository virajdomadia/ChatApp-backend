// server/socket/initSocket.js
import { Server } from "socket.io";

const onlineUsers = new Map(); // userId => socket.id

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://realtime-chatapp-beta.vercel.app/login",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join user room for online status
    socket.on("joinUser", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    // Join a chat room
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat ${chatId}`);
    });

    // Send message
    socket.on("sendMessage", (msg) => {
      const { chatId } = msg;
      socket.to(chatId).emit("receiveMessage", msg);
    });

    // Typing indicators
    socket.on("typing", ({ chatId, userId, userName }) => {
      socket.to(chatId).emit("typing", { userId, userName });
    });

    socket.on("stopTyping", ({ chatId, userId }) => {
      socket.to(chatId).emit("stopTyping", { userId });
    });

    // Disconnect
    socket.on("disconnect", () => {
      for (const [userId, sid] of onlineUsers.entries()) {
        if (sid === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export default initSocket;
