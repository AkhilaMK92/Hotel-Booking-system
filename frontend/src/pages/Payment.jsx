import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useEffect } from 'react';

const Payment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { room, checkIn, checkOut } = state || {};

  useEffect(() => {
    if (!room || !checkIn || !checkOut) {
      navigate('/search');
    }
  }, [room, checkIn, checkOut, navigate]);

  const handleConfirmBooking = async () => {
    try {
      const response = await axiosInstance.post(
        '/api/rooms/book',
        {
          roomId: room._id,
          checkIn,
          checkOut,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert('Booking successful!');
      navigate('/profile'); // or wherever you want to redirect
    } catch (error) {
      alert('Booking failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Confirm Your Booking</h2>

      <div className="mb-4">
        <p><strong>Room Number:</strong> {room?.roomNumber}</p>
        <p><strong>Type:</strong> {room?.type}</p>
        <p><strong>Price:</strong> ${room?.price}</p>
        <p><strong>Check-in:</strong> {checkIn}</p>
        <p><strong>Check-out:</strong> {checkOut}</p>
      </div>

      <button
        onClick={handleConfirmBooking}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Confirm & Pay
      </button>
    </div>
  );
};

export default Payment;
