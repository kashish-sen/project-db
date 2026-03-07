const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    await mongoose.connect("mongodb+srv://woxedgeofficial_db_user:admin123@cluster0.ycwvn54.mongodb.net/?appName=Cluster0");

    console.log("MongoDB Connected");

  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;