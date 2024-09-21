import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import recipientRoutes from './routes/recipients';
import airtableRoutes from './routes/airtable';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipients', recipientRoutes);
app.use('/api/airtable', airtableRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});