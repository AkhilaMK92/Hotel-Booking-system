import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const RoomResults = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { availableRooms, checkIn, checkOut } = state || {};

  useEffect(() => {
    if (!availableRooms || !checkIn || !checkOut) {
      navigate('/search'); // Redirect if someone lands directly
    }
  }, [availableRooms, checkIn, checkOut, navigate]);

  const handleProceedToPayment = (room) => {
    navigate('/payment', {
      state: {
        room,
        checkIn,
        checkOut,
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Available Rooms</h2>

      {availableRooms?.length > 0 ? (
        availableRooms.map((room) => (
          <div key={room._id} className="p-4 border mb-4 rounded shadow-sm">
            <p><strong>Room Number:</strong> {room.roomNumber}</p>
            <p><strong>Type:</strong> {room.type}</p>
            <p><strong>Price:</strong> ${room.price}</p>
            <button
              onClick={() => handleProceedToPayment(room)}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Proceed to Payment
            </button>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No rooms available for selected dates.</p>
      )}
    </div>
  );
};

export default RoomResults;
