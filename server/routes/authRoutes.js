import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

// GET all registered users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role, phone, establishmentName, vehicleType, location, serviceRadiusKm } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    const userId = 'usr-' + Date.now();
    const newUser = new User({
      id: userId,
      name,
      email: email.toLowerCase().trim(),
      password,
      role: role || 'donor',
      phone: phone || '',
      establishmentName: establishmentName || '',
      vehicleType: vehicleType || '',
      location: location || { lat: 17.3850, lng: 78.4867, address: 'Default Area', areaName: 'City Center' },
      serviceRadiusKm: serviceRadiusKm || 10,
      points: 0,
      tier: 'Bronze Donor',
      quizPassed: false
    });

    await newUser.save();
    
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ success: true, user: userResponse });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ success: false, error: 'No account found with this email address' });
    }

    if (password && user.password !== password) {
      return res.status(401).json({ success: false, error: 'Incorrect password' });
    }

    if (role && user.role !== role && role !== 'public') {
      return res.status(403).json({ 
        success: false, 
        error: `Account is registered as "${user.role.toUpperCase()}", not "${role.toUpperCase()}". Please switch role or log in through your role portal.` 
      });
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, user: userObj });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update Profile / Points / Quiz
router.put('/users/:id', async (req, res) => {
  try {
    const updated = await User.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
