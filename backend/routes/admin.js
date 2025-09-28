const express = require('express');
const { db } = require('../server');
const { auth, roleAuth } = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/users', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const [users] = await db.execute('SELECT id, name, email, role, created_at FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all events
router.get('/events', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const [events] = await db.execute('SELECT * FROM events');
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get all bookings
router.get('/bookings', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const [bookings] = await db.execute(
      'SELECT b.*, u.name as user_name, e.title as event_title FROM bookings b JOIN users u ON b.user_id = u.id JOIN events e ON b.event_id = e.id'
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Analytics
router.get('/analytics', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const [totalUsers] = await db.execute('SELECT COUNT(*) as count FROM users');
    const [totalEvents] = await db.execute('SELECT COUNT(*) as count FROM events');
    const [totalBookings] = await db.execute('SELECT COUNT(*) as count FROM bookings');
    const [totalRevenue] = await db.execute('SELECT SUM(total_amount) as revenue FROM bookings WHERE status = "confirmed"');

    res.json({
      totalUsers: totalUsers[0].count,
      totalEvents: totalEvents[0].count,
      totalBookings: totalBookings[0].count,
      totalRevenue: totalRevenue[0].revenue || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
