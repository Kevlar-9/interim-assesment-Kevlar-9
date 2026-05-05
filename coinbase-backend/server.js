const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: [
    'http://localhost:5173', 
    'https://interim-assesment-kevlar-9.onrender.com' // Example, replace with your actual frontend URL later
  ], 
  credentials: true 
}));

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Missing MongoDB URI environment variable. Set MONGO_URI in Render environment settings, or MONGODB_URI if you prefer that name.');
  process.exit(1);
}

// Allow localhost for development, but warn on production
if ((mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost')) && process.env.NODE_ENV === 'production') {
  console.error('MongoDB URI looks like a local database. Render cannot connect to localhost. Please set MONGO_URI to a remote MongoDB connection string.');
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log('DB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

app.use('/auth', require('./routes/authRoutes'));
app.use('/profile', require('./routes/userRoutes'));
app.use('/crypto', require('./routes/cryptoRoutes'));

app.get('/', (req, res) => {
  res.send('Coinbase Clone Backend is running!');
});

app.listen(3000, () => console.log('Server running'));