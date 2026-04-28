const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://your-frontend-url.com', credentials: true }));

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('Missing MONGO_URI environment variable. Set MONGO_URI in Render environment settings.');
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

app.listen(3000, () => console.log('Server running'));