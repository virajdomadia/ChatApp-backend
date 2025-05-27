import express from "express";
import protect from "../middleware/authMiddleware.js";
import { sendMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", protect, sendMessage); // Send message
router.get("/:chatId", protect, getMessages); // Get messages by chatId

export default router;
