import express from 'express';
import connectDB from './lib/mongodb';
import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes';
import userRoutes from './routes/userRoutes';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './lib/swagger-jaview.json';

dotenv.config();

const url_front = process.env.FRONT_URL;
const port = process.env.APP_PORT;

const app = express();

const corsOptions = {
  origin: url_front,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connectDB()
  .then(() => {
    app.listen(Number(port), '0.0.0.0', () => {
      console.log(`Server is listening in port ${port} 🚀`);
    });
  })
  .catch((error) => {
    console.log(`Error connecting with the database: ${error}`);
  });

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/movies', movieRoutes);
