import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";

const connectDB = async() => {
  try {
    const dbInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log(`\n  MONGODB CONNECTED !! DN HOST : ${dbInstance.connection.host}`);
  } catch (error) {
    console.log("Error while connecting DataBase", error);
    process.exit(1);
  }
};

export default connectDB