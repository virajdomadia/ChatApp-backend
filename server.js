import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

import connectDB from "./config/db.js";
import initSocket from "./sockets/socket.js";

import auth from "./routes/authRoutes.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("ChatApp Backend is running");
});

app.use("/api/auth", auth);

initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
