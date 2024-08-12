const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const DBConnection = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`Mongo DB connected to host: ${DBConnection.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error}`);

    process.exit(1);
  }
};

module.exports = connectDB;
