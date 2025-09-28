const { db } = require('../server');
const QRCode = require('qrcode');

const Booking = {
  create: (bookingData) => {
    return new Promise(async (resolve, reject) => {
      const { user_id, event_id, quantity, total_amount } = bookingData;
      db.run(
        'INSERT INTO bookings (user_id, event_id, quantity, total_amount) VALUES (?, ?, ?, ?)',
        [user_id, event_id, quantity, total_amount],
        async function(err) {
          if (err) return reject(err);
          const bookingId = this.lastID;

          // Generate QR codes for tickets
          try {
            for (let i = 0; i < quantity; i++) {
              const qrData = `Booking:${bookingId}-Ticket:${i}`;
              const qrCode = await QRCode.toDataURL(qrData);
              await new Promise((res, rej) => {
                db.run('INSERT INTO tickets (booking_id, qr_code) VALUES (?, ?)', [bookingId, qrCode], (err) => {
                  if (err) rej(err);
                  else res();
                });
              });
            }
            resolve(bookingId);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  },

  findByUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT b.*, e.title, e.date, e.location FROM bookings b JOIN events e ON b.event_id = e.id WHERE b.user_id = ?',
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM bookings WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  updateStatus: (id, status) => {
    return new Promise((resolve, reject) => {
      db.run('UPDATE bookings SET status = ? WHERE id = ?', [status, id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  getTickets: (bookingId) => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tickets WHERE booking_id = ?', [bookingId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

module.exports = Booking;
