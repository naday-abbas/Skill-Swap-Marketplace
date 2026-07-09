const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users.' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, title, bio, skillsHave, skillsWant } = req.body;

    if (!name || !email || !password || !title) {
      return res.status(400).json({ message: 'Please provide name, email, password, and title.' });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      title,
      bio: bio || '',
      skillsHave: skillsHave || [],
      skillsWant: skillsWant || []
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        title: newUser.title,
        bio: newUser.bio,
        skillsHave: newUser.skillsHave,
        skillsWant: newUser.skillsWant
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        title: user.title,
        bio: user.bio,
        skillsHave: user.skillsHave,
        skillsWant: user.skillsWant
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;