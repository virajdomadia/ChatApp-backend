import Chat from "../models/Chat.js";

const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).send({ message: "User ID is required" });
  }
  try {
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, userId], $size: 2 },
    }).populate("participants", "-password");

    if (chat) {
      return res.status(200).json(chat);
    }

    const newChat = await Chat.create({
      participants: [req.user._id, userId],
    });

    const fullChat = await Chat.findOne({ _id: newChat._id }).populate(
      "participants",
      "-password"
    );

    res.status(200).json(fullChat);
  } catch (error) {
    console.error("Error accessing chat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: { $in: [req.user._id] },
    })
      .populate("participants", "-password")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { accessChat, fetchChats };
