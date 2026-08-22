import express from 'express';
import { Volunteer } from '../models/Volunteer.js';

const router = express.Router();

// GET all volunteers
router.get('/', async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET volunteer by ID
router.get('/:id', async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ id: req.params.id });
    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// REGISTER / SYNC volunteer
router.post('/', async (req, res) => {
  try {
    const volData = req.body;
    const newId = volData.id || `vol-${Date.now()}`;
    
    let volunteer = await Volunteer.findOne({ id: newId });
    if (volunteer) {
      volunteer = await Volunteer.findOneAndUpdate({ id: newId }, { $set: volData }, { new: true });
    } else {
      volunteer = new Volunteer({ ...volData, id: newId });
      await volunteer.save();
    }

    res.status(201).json({ success: true, volunteer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE volunteer (status, location, radius, quiz score, points)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Volunteer.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Volunteer not found' });
    }

    res.json({ success: true, volunteer: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
