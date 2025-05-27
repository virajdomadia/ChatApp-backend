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
    socket.on("message", (data) => {
      console.log("Message received:", data);
      socket.broadcast.emit("message", data);
    });
    socket.on("disconnect", () => {
      console.log("Client Disconnected:", socket.id);
    });
  });
  return io;
};

export default initSocket;
