const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  title: {
    type: String,
    trim: true,
    required: true
  },
  bio: {
    type: String,
    trim: true
  },
  skillsHave: [{
    type: String,
    trim: true
  }],
  skillsWant: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);