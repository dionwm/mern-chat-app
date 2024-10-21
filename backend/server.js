const express = require("express");
const connectDB = require("./config/db");

const { pageNotFound, errorHandler } = require("./middleware/errorMiddleware");

// Config, Init etc.
require("dotenv").config();
connectDB();
const app = express();

app.use(express.json()); // allows app to accept JSON data

// Routes Imports
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");

// APIs
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

app.use(pageNotFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(5000, console.log(`Server running on port ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // methods: ["GET", "POST", "PUT", "P"],
  },
});

io.on("connection", (socket) => {
  console.log("connected with socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id); //creates "room" for that particular user
    socket.emit("connected");
  });

  socket.on("join-chat", (room) => {
    socket.join(room);
  });

  socket.on("is-typing", (room) => {
    socket.in(room).emit("is-typing");
  });
  socket.on("is-stopped-typing", (room) =>
    socket.in(room).emit("is-stopped-typing")
  );

  socket.on("new-message", (incomingMessage) => {
    let chat = incomingMessage.chat;

    if (!chat.users) return console.log("chat.users is empty");

    chat.users.forEach((user) => {
      if (user._id == incomingMessage.sender._id) return;
      socket.in(user._id).emit("incoming-message", incomingMessage);
    });
  });

  // socket.off("setup", () => {
  //   console.log("User disconnected");
  //   socket.leave(userData._id);
  // });
});
