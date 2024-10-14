import express, { response } from "express";
import connectDB from "./lib/mongodb";
import authRoutes from "./routes/authRoutes";
import movieRoutes from "./routes/movieRoutes";

const app = express();
app.use(express.json());

connectDB()
  .then(() => {
    app.listen(3333, () => {
      console.log(`Server is listening in port 3333 🚀`);
    });
  })
  .catch((error) => {
    message: `Error connecting with the database: ${error}`;
  });

app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
