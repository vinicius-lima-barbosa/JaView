import express, { response } from "express";
import connectDB from "./lib/mongodb";
import authRoutes from "./routes/authRoutes";
import movieRoutes from "./routes/movieRoutes";
import userRoutes from "./routes/userRoutes";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB()
  .then(() => {
    app.listen(3333, () => {
      console.log(`Server is listening in port 3333 🚀`);
    });
  })
  .catch((error) => {
    `Error connecting with the database: ${error}`;
  });

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/movies", movieRoutes);
