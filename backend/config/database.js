import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Check if already connected
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If connection is in progress, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000, // Increased to 30 seconds
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000, // Added connection timeout
    };

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set. Please create a .env file in the backend directory with your MongoDB connection string.');
    }

    // Check if MONGO_URI contains placeholder
    if (process.env.MONGO_URI.includes('<PASSWORD>')) {
      throw new Error('MONGO_URI contains <PASSWORD> placeholder. Please replace it with your actual MongoDB password in the .env file.');
    }

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      return mongoose;
    }).catch((error) => {
      cached.promise = null;
      console.error(`MongoDB connection error: ${error.message}`);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default connectDB;
