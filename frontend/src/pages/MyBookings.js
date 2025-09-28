import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import QRCode from 'qrcode.react';

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      setBookings(res.data);
    } catch (error) {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Please login</div>;
  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No bookings found.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{booking.event_title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">Date: {new Date(booking.event_date).toLocaleDateString()}</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">Location: {booking.event_location}</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">Quantity: {booking.quantity}</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">Total: ${booking.total_amount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status: {booking.status}</p>
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Ticket QR Code</h4>
                  {booking.qr_code ? (
                    <QRCode value={booking.qr_code} size={128} />
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">QR code not available</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
