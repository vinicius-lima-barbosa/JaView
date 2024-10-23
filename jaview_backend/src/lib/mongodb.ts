import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const db_user = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_domain = process.env.DB_DOMAIN;
const db_name = process.env.DB_DATABASE;

const mongoPATH =
  process.env.MONGODB_URI ||
  `mongodb+srv://${db_user}:${db_password}@${db_domain}.mongodb.net/${db_name}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoPATH);
    console.log("Database connected!");
  } catch (error) {
    console.log(`Error connecting database: ${error}`);
  }
};

export default connectDB;
