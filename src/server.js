import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRoutes }  from './routes/authRoutes.js';
import { profileRoutes } from './routes/profileRoutes.js';
import { usersRoutes } from './routes/usersRoutes.js';
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/users', usersRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
