import express from 'express';
import { DonationRequest } from '../models/DonationRequest.js';

const router = express.Router();

// GET all requests / donations
router.get('/', async (req, res) => {
  try {
    const requests = await DonationRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single request by ID
router.get('/:id', async (req, res) => {
  try {
    const request = await DonationRequest.findOne({ id: req.params.id });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new donation or relief demand request
router.post('/', async (req, res) => {
  try {
    const requestData = req.body;
    const newId = requestData.id || `req-${Date.now()}`;
    const isSmall = (requestData.quantityKg || 0) < 15;

    const newRequest = new DonationRequest({
      ...requestData,
      id: newId,
      isSmallQuantity: isSmall,
      status: requestData.status || (isSmall ? 'pooled' : 'requested'),
      createdAt: requestData.createdAt || new Date().toISOString()
    });

    await newRequest.save();
    res.status(201).json({ success: true, request: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE request (status, assigned volunteer, proofs, etc.)
router.put('/:id', async (req, res) => {
  try {
    const updated = await DonationRequest.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    res.json({ success: true, request: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE request
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await DonationRequest.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }
    res.json({ success: true, message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
