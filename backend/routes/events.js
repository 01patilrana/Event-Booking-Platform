const express = require('express');
const Event = require('../models/event');
const { auth, roleAuth } = require('../middleware/auth');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create event (organizer only)
router.post('/', auth, roleAuth(['organizer', 'admin']), async (req, res) => {
  try {
    const eventData = { ...req.body, organizer_id: req.user.id };
    const eventId = await Event.create(eventData);
    res.status(201).json({ id: eventId, ...eventData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event (organizer or admin)
router.put('/:id', auth, roleAuth(['organizer', 'admin']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (req.user.role !== 'admin' && event.organizer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await Event.update(req.params.id, req.body);
    res.json({ message: 'Event updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event (organizer or admin)
router.delete('/:id', auth, roleAuth(['organizer', 'admin']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (req.user.role !== 'admin' && event.organizer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await Event.delete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
