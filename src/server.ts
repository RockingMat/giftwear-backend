import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import recipientRoutes from './routes/recipients';
import airtableRoutes from './routes/airtable';
import emailRoutes from './routes/emails';
import path from 'path';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Use environment variable for frontend URL
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipients', recipientRoutes);
app.use('/api/airtable', airtableRoutes);
app.use('/api/emails', emailRoutes);

export default app;
