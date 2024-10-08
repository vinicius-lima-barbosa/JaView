import express, { response } from "express";
import connectDB from "./lib/mongodb";
import authRoutes from "./routes/authRoutes";
import dotenv from "dotenv";
import movieRoutes from "./routes/movieRoutes";

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3333;

app.use(express.json());

app.get("/", async (request, response) => {
  await connectDB();
  response.send({ message: "Test API" });
});

app.use("/auth", authRoutes);
app.use("/post", movieRoutes);

app.listen(3333, () => {
  console.log(`Server is listening in port ${PORT} 🚀`);
});
