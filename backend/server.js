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

app.listen(5000, console.log(`Server running on port ${PORT}`));
