import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.js';
import verifyToken from './middlewares/authMiddleware.js';
import rtoAdmin from './routes/rtoAdmin.js';
import cors from 'cors';
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());
// Public Routes
app.use('/api/auth', authRoutes);

// Protected Route
// app.use('/api/auth',verifyToken, authRoutes);
app.use('/api/',verifyToken, rtoAdmin);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});