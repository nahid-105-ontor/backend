require("dotenv").config();
const mongoose = require("mongoose");
const dbName = require("../constants");

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}/${dbName}`);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};
module.exports = connectDB;