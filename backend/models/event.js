const { db } = require('../server');

const Event = {
  create: (eventData) => {
    return new Promise((resolve, reject) => {
      const { title, description, date, location, price, capacity, organizer_id } = eventData;
      db.run(
        'INSERT INTO events (title, description, date, location, price, capacity, organizer_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, description, date, location, price, capacity, organizer_id],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  },

  findAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM events ORDER BY date ASC', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM events WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  findByOrganizer: (organizerId) => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM events WHERE organizer_id = ?', [organizerId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  update: (id, eventData) => {
    return new Promise((resolve, reject) => {
      const { title, description, date, location, price, capacity } = eventData;
      db.run(
        'UPDATE events SET title = ?, description = ?, date = ?, location = ?, price = ?, capacity = ? WHERE id = ?',
        [title, description, date, location, price, capacity, id],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM events WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};

module.exports = Event;
