const express = require('express');
const Booking = require('../models/booking');
const Event = require('../models/event');
const User = require('../models/user');
const { auth } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendBookingConfirmation } = require('../utils/email');

const router = express.Router();

// Get user bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.findByUser(req.user.id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { event_id, quantity } = req.body;
    const event = await Event.findById(event_id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const total_amount = event.price * quantity;

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total_amount * 100, // Stripe expects amount in cents
      currency: 'usd',
      metadata: { event_id, user_id: req.user.id, quantity }
    });

    // For simplicity, assume payment succeeds and create booking
    // In real app, handle webhook for confirmation
    const bookingId = await Booking.create({
      user_id: req.user.id,
      event_id,
      quantity,
      total_amount
    });

    // Send confirmation email
    const user = await User.findById(req.user.id);
    await sendBookingConfirmation(user.email, event.title, bookingId);

    res.status(201).json({ bookingId, client_secret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get booking tickets
router.get('/:id/tickets', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    const tickets = await Booking.getTickets(req.params.id);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

module.exports = router;
