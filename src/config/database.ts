// src/config/database.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/role_management';
    
    await mongoose.connect(mongoUri, {
      // Deprecated options removed
    });
    
    console.log('MongoDB Connected Successfully');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('MongoDB Connection Error:', error.message);
    }
    // Exit process with failure
    process.exit(1);
  }
};

// Mongoose configuration
mongoose.set('strictQuery', true);

export default connectDB;