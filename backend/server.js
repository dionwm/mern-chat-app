const express = require("express");
const { chats } = require("./data/data");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/chats", (req, res) => {
  res.send(chats);
});

app.get("/api/chats/:chat_id", (req, res) => {
  const {
    params: { chat_id },
  } = req;

  console.log(chat_id);

  let singleChat = chats.find((chat) => chat._id === chat_id);

  res.send(singleChat);
});

const PORT = process.env.PORT || 5000;

app.listen(5000, console.log(`Server running on port ${PORT}`));
