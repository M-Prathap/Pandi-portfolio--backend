import mongoose from 'mongoose';
import { useFileDb } from './dbMode.js';
import { connectJsonDB } from '../db/jsonDb.js';

export async function connectDB(uri) {
  if (useFileDb()) {
    await connectJsonDB();
    if (uri && (uri.includes('YOUR_DB_PASSWORD') || uri.includes('<PASSWORD>'))) {
      console.warn('⚠️ MONGODB_URI has placeholder <PASSWORD>. Replace <PASSWORD> in .env with your real MongoDB Atlas password to connect to Atlas.');
    }
    console.log('Database connected (JSON file store — set MONGODB_URI=mongodb://... for MongoDB)');
    return;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('MongoDB Atlas connected');
}

export async function stopMemoryDB() {
  if (!useFileDb() && mongoose.connection.readyState) {
    await mongoose.disconnect();
  }
}
