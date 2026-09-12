const router = require('express').Router();
const Message = require('../models/Message');
const verifyToken = require('../middleware/authMiddleware');

// Send message from contact form (Public)
router.post('/', async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all messages (Protected - Admin Only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
