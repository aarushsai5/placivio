const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI?.trim();

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  try {
    cached.conn = await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');
    return cached.conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

module.exports = { connectDB };
