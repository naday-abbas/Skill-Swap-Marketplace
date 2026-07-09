require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import the routes you just created
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  family: 4, 
  serverSelectionTimeoutMS: 5000 
})
  .then(() => console.log('✅ Successfully connected to MongoDB Atlas!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// Tell the server to use your auth routes whenever someone hits /api/users
app.use('/api/users', authRoutes);

// A simple test route
app.get('/', (req, res) => {
  res.send('Skill Swap API is running perfectly.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});