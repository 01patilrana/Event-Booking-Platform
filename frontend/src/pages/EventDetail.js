import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_your_stripe_publishable_key');

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/events/${id}`);
      setEvent(res.data);
    } catch (error) {
      console.error('Failed to fetch event');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const stripe = await stripePromise;
      const res = await axios.post('http://localhost:5000/api/bookings', {
        eventId: id,
        quantity,
      });

      const { sessionId } = res.data;
      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      alert('Booking failed');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!event) return <div className="text-center py-8">Event not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <img src="https://via.placeholder.com/800x400" alt={event.title} className="w-full h-64 object-cover rounded-lg mb-6" />
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">{event.title}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Time:</strong> {event.time}</p>
          <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Location:</strong> {event.location}</p>
          <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Capacity:</strong> {event.capacity}</p>
        </div>
        <div>
          <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Price:</strong> ${event.price}</p>
          <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Organizer:</strong> {event.organizer_name}</p>
        </div>
      </div>

      {user && user.role === 'attendee' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Book Tickets</h2>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              max={event.capacity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <p className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Total: ${event.price * quantity}</p>
          <button
            onClick={handleBooking}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Book Now
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
