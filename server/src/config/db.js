const mongoose = require('mongoose');


async function connectDb() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/screen';
  if (!mongoUri) throw new Error('Missing MONGO_URI');
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
}

module.exports = { connectDb };