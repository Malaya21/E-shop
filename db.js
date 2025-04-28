const mongoose = require("mongoose");
require("dotenv").config();

const connect = async () => {
  const MongoDBUrl = process.env.URI;
  if (!MongoDBUrl) {
    console.error("MongoDB URI is not defined in environment variables");
    return;
  }

  try {
    await mongoose.connect(MongoDBUrl);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("MongoDB Error:", error.message);
  }
};



module.exports = connect();
