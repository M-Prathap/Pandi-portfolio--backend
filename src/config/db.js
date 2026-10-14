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

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    console.log('MongoDB Atlas connected');
  } catch (err) {
    if (err.code === 8000 || (err.message && err.message.includes('authentication failed'))) {
      console.error('\n❌ MONGODB ATLAS AUTHENTICATION FAILED:');
      console.error('1. Check that the username and password in MONGODB_URI on Render are correct.');
      console.error('2. Make sure this user exists under MongoDB Atlas -> "Database Access" (not your Atlas website login email).');
      console.error('3. If your password has special characters (@, #, $, %, etc.), URL-encode them (e.g., @ -> %40).\n');
    }
    throw err;
  }
}

export async function stopMemoryDB() {
  if (!useFileDb() && mongoose.connection.readyState) {
    await mongoose.disconnect();
  }
}
