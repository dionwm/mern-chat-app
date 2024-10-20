const expressAsyncHandler = require("express-async-handler");

const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const getMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chat_id })
      .populate("sender", "firstName lastName email profilePicture")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chat_id } = req.body;

  if (!content || !chat_id) {
    console.log("Missing message content / chat_id");
    return res.sendStatus(400);
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chat_id,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate(
      "sender",
      "firstName lastName profilePicture"
    );

    message = await message.populate("chat");

    message = await User.populate(message, {
      path: "chat.users",
      select: "firstName lastName email",
    });

    await Chat.findByIdAndUpdate(req.body.chat_id, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  getMessages,
  sendMessage,
};
