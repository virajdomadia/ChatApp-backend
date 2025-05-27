import Message from "../models/Message.js";

const sendMessage = async (req, res) => {
  const { chatId, text } = req.body;

  if (!chatId || !text) {
    return res.status(400).send("Missing chatId or text");
  }

  try {
    const newMessage = await Message.create({
      sender: req.user._id,
      text,
      chat: chatId,
    });

    const fullMessage = await Message.findById(newMessage._id)
      .populate("sender", "name email")
      .populate("chat");

    res.status(201).json(fullMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to get messages" });
  }
};

export { sendMessage, getMessages };
