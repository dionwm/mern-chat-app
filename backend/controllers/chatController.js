const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// Create/Fetch a chat
const fetchUserChat = expressAsyncHandler(async (req, res) => {
  const { userID } = req.body;

  if (!userID) {
    console.log("UserID not present in request");
    return res.sendStatus(400);
  }

  let isChatExist = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userID } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChatExist = await User.populate(isChatExist, {
    path: "latestMessage.sender",
    select: "firstName LastName profilePicture email",
  });

  if (isChatExist.length > 0) {
    res.send(isChatExist[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userID],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
});

// GET all chats of user
const fetchAllChats = expressAsyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "firstName, lastName, email, profilePicture",
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Create a new Group chat
const createGroupChat = expressAsyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.groupChatName) {
    return res
      .status(400)
      .send({ message: "Group chats must have a name and users" });
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400).send("Group chats must contain more than 2 people");
  }

  users.push(req.user);

  try {
    const newGroupChat = await Chat.create({
      chatName: req.body.groupChatName,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const createdGroupChat = await Chat.findOne({ _id: newGroupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(createdGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroupChat = expressAsyncHandler(async (req, res) => {
  const { chatID, newGroupName } = req.body;

  const updatedGroupChat = await Chat.findByIdAndUpdate(
    chatID,
    {
      chatName: newGroupName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedGroupChat) {
    res.status(404);
    throw new Error("The group chat you are trying to update cannot be found.");
  } else {
    res.json(updatedGroupChat);
  }
});

const addUserToGroupChat = expressAsyncHandler(async (req, res) => {
  const { chatID, userID } = req.body;

  const addNewUser = await Chat.findByIdAndUpdate(
    chatID,
    {
      $push: { users: userID },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addNewUser) {
    res.status(404);
    throw new Error("The group chat you are trying to update cannot be found.");
  } else {
    res.json(addNewUser);
  }
});

const removeUserFromGroupChat = expressAsyncHandler(async (req, res) => {
  const { chatID, userID } = req.body;

  const removeUser = await Chat.findByIdAndUpdate(
    chatID,
    {
      $pull: { users: userID },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removeUser) {
    res.status(404);
    throw new Error("The group chat you are trying to update cannot be found.");
  } else {
    res.json(removeUser);
  }
});

module.exports = {
  fetchUserChat,
  fetchAllChats,
  createGroupChat,
  renameGroupChat,
  addUserToGroupChat,
  removeUserFromGroupChat,
};
