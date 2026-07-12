const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Swap = require('../models/Swap');

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, title, bio, skillsHave, skillsWant } = req.body;
    if (!name || !email || !password || !title) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name, email, password: hashedPassword, title, bio: bio || '',
      skillsHave: skillsHave || [], skillsWant: skillsWant || []
    });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: newUser._id, name: newUser.name } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user: { id: user._id, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, title, bio, skillsHave, skillsWant } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { name, title, bio, skillsHave, skillsWant },
      { new: true }
    ).select('-password');
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/swap', verifyToken, async (req, res) => {
  try {
    const { receiverId } = req.body;
    const existing = await Swap.findOne({ senderId: req.userId, receiverId });
    if (existing) return res.status(400).json({ message: 'Request already sent' });
    const swap = new Swap({ senderId: req.userId, receiverId });
    await swap.save();
    res.status(201).json(swap);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/swaps', verifyToken, async (req, res) => {
  try {
    const incoming = await Swap.find({ receiverId: req.userId }).populate('senderId', 'name title skillsHave');
    const outgoing = await Swap.find({ senderId: req.userId }).populate('receiverId', 'name title skillsHave');
    res.status(200).json({ incoming, outgoing });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/swap/:id', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const swap = await Swap.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json(swap);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;