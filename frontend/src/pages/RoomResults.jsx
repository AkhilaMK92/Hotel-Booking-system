import { useLocation, useNavigate } from 'react-router-dom';

const RoomResults = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { availableRooms, checkIn, checkOut } = state || {};

  const handleProceedToPayment = (room) => {
    navigate('/payment', {
      state: { room, checkIn, checkOut }
    });
  };

  console.log("Rooms received:", availableRooms);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Available Rooms</h2>

      {availableRooms?.length > 0 ? (
        availableRooms.map((room) => (
          <div key={room._id} className="border p-4 mb-4 rounded shadow-sm">
            <p><strong>Room Number:</strong> {room.roomNumber}</p>
            <p><strong>Room Type:</strong> {room.type}</p>
            <p><strong>Price:</strong> ${room.price}</p>
            <button
              onClick={() => handleProceedToPayment(room)}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
            >
              Proceed to Payment
            </button>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">
          No rooms available for selected dates.
        </p>
      )}
    </div>
  );
};

export default RoomResults;
