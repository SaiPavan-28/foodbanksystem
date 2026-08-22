import express from 'express';
import { Notification } from '../models/Notification.js';

const router = express.Router();

// GET notifications by recipient role or ID
router.get('/', async (req, res) => {
  try {
    const { role, recipientId } = req.query;
    let query = {};
    if (role) {
      query.$or = [{ recipientRole: role }, { recipientRole: 'public' }];
    }
    if (recipientId) {
      query.recipientId = recipientId;
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new notification
router.post('/', async (req, res) => {
  try {
    const { recipientRole, recipientId, title, message, requestId } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, error: 'title and message are required' });
    }

    const newNotification = new Notification({
      id: `notif-${Date.now()}`,
      recipientRole: recipientRole || 'donor',
      recipientId: recipientId || '',
      title,
      message,
      requestId: requestId || '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    });

    await newNotification.save();
    res.status(201).json({ success: true, notification: newNotification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE / MARK AS READ
router.delete('/:id', async (req, res) => {
  try {
    await Notification.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Notification cleared' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
