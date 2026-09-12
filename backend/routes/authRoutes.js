const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Admin (First time setup ke liye)
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'Admin registered successfully', userId: savedUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Admin
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
    res.json({ token, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
