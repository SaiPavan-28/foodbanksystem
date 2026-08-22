import express from 'express';
import { Chat } from '../models/Chat.js';

const router = express.Router();

// GET chat messages for a specific request
router.get('/:requestId', async (req, res) => {
  try {
    const messages = await Chat.find({ requestId: req.params.requestId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all chats (for overview)
router.get('/', async (req, res) => {
  try {
    const messages = await Chat.find().sort({ createdAt: -1 }).limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new chat message
router.post('/', async (req, res) => {
  try {
    const { requestId, senderRole, senderName, text, channel } = req.body;
    if (!requestId || !text) {
      return res.status(400).json({ success: false, error: 'requestId and text are required' });
    }

    const newMessage = new Chat({
      id: `chat-${Date.now()}`,
      requestId,
      senderRole: senderRole || 'volunteer',
      senderName: senderName || 'User',
      text,
      channel: channel || 'vol_donor',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    await newMessage.save();
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
