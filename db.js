const mongoose = require('mongoose');

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Copy .env.example to .env.');
  }
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
}

module.exports = connectDatabase;
