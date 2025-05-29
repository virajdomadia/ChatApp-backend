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

    socket.on("disconnect", () => {
      console.log("Client Disconnected:", socket.id);
    });
  });

  return io;
};

export default initSocket;
