import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const BookingHistory = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosInstance.get('/api/rooms/history', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching booking history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchHistory();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Booking History</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-600">No bookings yet.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="border p-4 mb-4 rounded shadow-sm">
            <p><strong>Room Number:</strong> {booking.room?.roomNumber}</p>
            <p><strong>Room Type:</strong> {booking.room?.type}</p>
            <p><strong>Price:</strong> ${booking.room?.price}</p>
            <p><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default BookingHistory;
