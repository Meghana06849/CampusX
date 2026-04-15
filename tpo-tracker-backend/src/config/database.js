import mongoose from 'mongoose';

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && cachedConnection.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI not found. Add it to Vercel Environment Variables:');
      console.error('   • Go to Vercel Dashboard → Select Project → Settings');
      console.error('   • Click Environment Variables');
      console.error('   • Add: MONGO_URI = mongodb+srv://...');
      throw new Error('MONGO_URI is missing - cannot connect to MongoDB');
    }

    console.log('🔄 Connecting to MongoDB...');
    cachedConnection = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 3,
      minPoolSize: 0,
      maxIdleTimeMS: 45000,
      // Connection timeouts - increased for slow networks
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      family: 4,
      retryWrites: true,
    });
    
    console.log('✅ MongoDB connected:', cachedConnection.connection.host);
    return cachedConnection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    cachedConnection = null;
    throw error;
  }
};

export default connectDB;
