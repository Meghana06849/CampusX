import mongoose from 'mongoose';

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }

    cachedConnection = await mongoose.connect(process.env.MONGO_URI, {
      // Serverless optimizations
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      // Faster timeouts for serverless
      connectTimeoutMS: 5000,      // Fail faster if network is down
      socketTimeoutMS: 5000,       // Close idle sockets faster
      serverSelectionTimeoutMS: 5000, // Quick server discovery
      family: 4,                    // Use IPv4 only for faster DNS
    });
    
    console.log('MongoDB connected:', cachedConnection.connection.host);
    return cachedConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    cachedConnection = null; // Reset on error
    throw error;
  }
};

export default connectDB;
