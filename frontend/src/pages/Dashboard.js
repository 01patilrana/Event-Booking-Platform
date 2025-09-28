import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user) {
      if (user.role === 'organizer') {
        fetchMyEvents();
      } else if (user.role === 'attendee') {
        fetchMyBookings();
      }
    }
  }, [user]);

  const fetchMyEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      setEvents(res.data.filter(event => event.organizer_id === user.id));
    } catch (error) {
      console.error('Failed to fetch events');
    }
  };

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      setBookings(res.data);
    } catch (error) {
      console.error('Failed to fetch bookings');
    }
  };

  if (!user) return <div>Please login</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard</h1>
      <p className="text-lg mb-4 text-gray-600 dark:text-gray-300">Welcome, {user.name}!</p>
      <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">Role: {user.role}</p>

      {user.role === 'organizer' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">My Events</h2>
          {events.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No events created yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <div key={event.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{event.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{event.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date: {new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location: {event.location}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price: ${event.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {user.role === 'attendee' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">My Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{booking.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">Date: {new Date(booking.date).toLocaleDateString()}</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">Location: {booking.location}</p>
                  <p className="text-gray-600 dark:text-gray-300">Quantity: {booking.quantity} - Total: ${booking.total_amount}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {user.role === 'admin' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Admin Panel</h2>
          <p className="text-gray-600 dark:text-gray-300">Access admin features from the navigation.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
