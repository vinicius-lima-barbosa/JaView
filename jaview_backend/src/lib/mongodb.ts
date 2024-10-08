import mongoose from "mongoose";
// `mongodb://${username}:${password}@${domain}:${port}/${db}?authSource=admin`
// "mongodb://root:password@localhost:3333/jaview_test?authSource=admin"

// const username = process.env.DB_USERNAME;
// const password = process.env.DB_PASSWORD;
// const domain = process.env.DB_DOMAIN;
// const port = process.env.DB_PORT;
// const db = process.env.DB_DATABASE;

const mongoPATH =
  process.env.MONGODB_URI ||
  "mongodb://root:password@localhost:27017/jaview_test?authSource=admin";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoPATH);
    console.log("Database connected!");
  } catch (error) {
    console.log(`Error connecting database: ${error}`);
  }
};

export default connectDB;
