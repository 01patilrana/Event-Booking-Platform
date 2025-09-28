import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      setEvents(res.data);
    } catch (error) {
      console.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img src="https://via.placeholder.com/300x200" alt={event.title} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{event.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">{event.description?.substring(0, 100)}...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Date: {new Date(event.date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Location: {event.location}</p>
            <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mb-4">${event.price}</p>
            <Link
              to={`/events/${event.id}`}
              className="block w-full bg-secondary-600 text-white py-2 px-4 rounded-lg text-center hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
