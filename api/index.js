// Vercel serverless function wrapper for Express backend
import express from 'express';
import cors from 'cors';
import { connectDB } from '../backend/src/db.js';
import authRoutes from '../backend/src/routes/auth.js';
import aiRoutes from '../backend/src/routes/ai.js';
import publishRoutes from '../backend/src/routes/publish.js';
import uploadRoutes from '../backend/src/routes/upload.js';

const app = express();

app.use(cors());
app.use(express.json());

// Initialize DB connection (uses connection pooling for serverless)
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await connectDB();
      dbInitialized = true;
    } catch (error) {
      console.error('DB connection failed:', error);
    }
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', publishRoutes);
app.use('/api', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', dbConnected: dbInitialized });
});

export default app;
