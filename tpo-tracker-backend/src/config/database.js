import mongoose from 'mongoose';

let cachedConnection = null;
let connectionAttempts = 0;
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

const connectDB = async () => {
  // Return cached connection if it's still alive
  if (cachedConnection && cachedConnection.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    if (!mongoUri) {
      console.error('❌ MONGO_URI/MONGODB_URI not found. Add it to Vercel Environment Variables:');
      console.error('   • Go to Vercel Dashboard → Select Project → Settings');
      console.error('   • Click Environment Variables');
      console.error('   • Add: MONGO_URI = mongodb+srv://...');
      throw new Error('MONGO_URI (or MONGODB_URI) is missing - cannot connect to MongoDB');
    }

    connectionAttempts++;
    console.log(`🔄 Connecting to MongoDB (attempt ${connectionAttempts})...`);
    
    cachedConnection = await mongoose.connect(mongoUri, {
      // Serverless pooling for Vercel
      maxPoolSize: 3,
      minPoolSize: 0,
      maxIdleTimeMS: 60000,
      
      // CRITICAL: Increased timeouts for cold starts and slow Atlas connections
      connectTimeoutMS: 60000,          // 60 seconds for initial connection
      socketTimeoutMS: 60000,            // 60 seconds for socket operations
      serverSelectionTimeoutMS: 60000,   // 60 seconds for server discovery

    });
    
    connectionAttempts = 0;
    console.log('✅ MongoDB connected successfully:', cachedConnection.connection.host);
    return cachedConnection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    cachedConnection = null;
    
    // Retry once after a short delay
    if (connectionAttempts < 2) {
      console.log('⏳ Retrying connection in 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return connectDB();
    }
    
    throw error;
  }
};

export default connectDB;
