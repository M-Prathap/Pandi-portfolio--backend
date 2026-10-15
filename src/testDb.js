import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uri = process.env.MONGODB_URI || '';

console.log('\n--- MongoDB Atlas Connection Test ---');

if (!uri) {
  console.error('❌ MONGODB_URI is not set in your .env file.\n');
  process.exit(1);
}

if (uri.includes('<PASSWORD>') || uri.includes('YOUR_DB_PASSWORD')) {
  console.error('❌ MONGODB_URI still has the literal placeholder <PASSWORD>.');
  console.error('👉 Open .env and replace <PASSWORD> with your real MongoDB Atlas password.\n');
  process.exit(1);
}

// Check for unencoded special characters in password
try {
  const match = uri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@/);
  if (match) {
    const [, user, pass] = match;
    console.log(`👤 Testing user: ${user}`);
    if (/[#@/:]/.test(pass)) {
      console.warn('⚠️ WARNING: Your password contains unencoded special characters (#, @, /, :).');
      console.warn('   This can cause MongoDB to fail authentication.');
      console.warn('   Encode them (e.g. @ -> %40, # -> %23) or use a password with only letters and numbers.\n');
    }
  }
} catch {
  // Ignore regex error
}

console.log('⏳ Connecting to MongoDB Atlas...');

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log('🎉 SUCCESS! Connected to MongoDB Atlas successfully.');
  console.log('✅ Your credentials are 100% correct!');
  console.log('\n👉 You can now safely copy your MONGODB_URI into your Render dashboard.\n');
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error('\n❌ CONNECTION FAILED:');
  if (err.code === 8000 || err.message?.includes('authentication failed')) {
    console.error('Reason: Bad Auth (Authentication Failed).');
    console.error('MongoDB Atlas rejected this username or password.');
    console.error('\nHow to fix:');
    console.error('1. Go to cloud.mongodb.com -> Security -> Database Access.');
    console.error('2. Confirm the username exists, or click "Add New Database User".');
    console.error('3. Set a simple password (e.g. letters and numbers only) and update .env.\n');
  } else if (err.name === 'MongooseServerSelectionError') {
    console.error('Reason: Could not reach MongoDB cluster (Timeout).');
    console.error('\nHow to fix:');
    console.error('1. Go to cloud.mongodb.com -> Security -> Network Access.');
    console.error('2. Ensure 0.0.0.0/0 (Allow from anywhere) is active.\n');
  } else {
    console.error(err.message);
  }
  process.exit(1);
}
