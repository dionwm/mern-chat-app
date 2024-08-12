const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

const { chats } = require("./data/data");
const { pageNotFound, errorHandler } = require("./middleware/errorMiddleware");

// Config, Init etc.
connectDB();
const app = express();
app.use(express.json()); // allows app to accept JSON data

// Routes Imports
const userRoute = require("./routes/userRoute");

// APIs
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoute);

app.use(pageNotFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(5000, console.log(`Server running on port ${PORT}`));
