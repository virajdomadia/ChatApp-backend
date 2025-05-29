// server/socket/initSocket.js
import { Server } from "socket.io";

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client Connected:", socket.id);

    socket.on("join", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("sendMessage", (msg) => {
      const { chatId } = msg;
      console.log(`Broadcasting message to chatId ${chatId}:`, msg);
      socket.to(chatId).emit("receiveMessage", msg);
    });

    // New: Typing indicator events
    socket.on("typing", ({ chatId, userId, userName }) => {
      socket.to(chatId).emit("typing", { userId, userName });
    });

    socket.on("stopTyping", ({ chatId, userId }) => {
      socket.to(chatId).emit("stopTyping", { userId });
    });

    socket.on("disconnect", () => {
      console.log("Client Disconnected:", socket.id);
    });
  });

  return io;
};

export default initSocket;
