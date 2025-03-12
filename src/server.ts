// src/server.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/database';

// Load environment variables
dotenv.config();

// Create Express application
const app: Application = express();

// Middleware
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './src/views')
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Import Routes (TypeScript)
import roleRoutes from './routes/roleRoutes';
import userRoutes from './routes/userRoutes';
import locationRoutes from './routes/locationRoutes';
import assetRoutes from './routes/assetRoutes';
import featureRoutes from './routes/featureRoutes';
import AuthRoute from '@routes/authroutes';

import { authMiddleware } from '@middleware/authMiddleware';
// Use Routes
app.use('/api/roles',async (req:Request,res:Response,next:NextFunction)=>{await authMiddleware(req,res,next)}, roleRoutes);
app.use('/api/users',async (req:Request,res:Response,next:NextFunction)=>{await authMiddleware(req,res,next)}, userRoutes);
app.use('/api/locations',async (req:Request,res:Response,next:NextFunction)=>{await authMiddleware(req,res,next)}, locationRoutes);
app.use('/api/assets',async (req:Request,res:Response,next:NextFunction)=>{await authMiddleware(req,res,next)}, assetRoutes);
app.use('/api/features',async (req:Request,res:Response,next:NextFunction)=>{await authMiddleware(req,res,next)}, featureRoutes);
app.use("/api/auth",AuthRoute );

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({
    status: 'error',
    message: err.message || 'Something went wrong!'
  });
});

// Start Server
const PORT: number = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});