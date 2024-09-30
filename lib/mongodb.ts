import mongoose from 'mongoose';

const connectMongo = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  // Only connect if there's no existing connection
  if (mongoose.connections[0].readyState) return;

  await mongoose.connect(mongoUri);
};

export default connectMongo;
