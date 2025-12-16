import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Check if already connected
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log('[DB] Using cached MongoDB connection');
    return cached.conn;
  }

  // If connection is in progress, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    };

    if (!process.env.MONGO_URI) {
      const error = 'MONGO_URI environment variable is not set';
      console.error(`❌ ${error}`);
      throw new Error(error);
    }

    if (process.env.MONGO_URI.includes('<PASSWORD>')) {
      const error = 'MONGO_URI contains <PASSWORD> placeholder - update with real credentials';
      console.error(`❌ ${error}`);
      throw new Error(error);
    }

    console.log('[DB] Initiating MongoDB connection...');
    
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        console.log(`✓ MongoDB Connected to: ${mongoose.connection.host}`);
        return mongoose;
      })
      .catch((error) => {
        cached.promise = null;
        console.error(`❌ MongoDB connection failed: ${error.message}`);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('[DB] Connection attempt failed, clearing cache');
    throw e;
  }

  return cached.conn;
};

export default connectDB;
