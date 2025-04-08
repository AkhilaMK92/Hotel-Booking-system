import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const SearchRooms = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomType, setRoomType] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSearch = async () => {
    const capitalizedType = roomType.charAt(0).toUpperCase() + roomType.slice(1);

    try {
      const response = await axiosInstance.post(
        '/api/rooms/search',
        {
          checkIn,
          checkOut,
          roomType: capitalizedType,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      navigate('/results', {
        state: {
          availableRooms: response.data,
          checkIn,
          checkOut,
        },
      });
    } catch (error) {
      alert('Search failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6 text-center">Search for Hotel Rooms</h1>

      <input
        type="date"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
        placeholder="Check-in Date"
      />
      <input
        type="date"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
        placeholder="Check-out Date"
      />
      <select
        value={roomType}
        onChange={(e) => setRoomType(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">Select Room Type</option>
        <option value="single">Single</option>
        <option value="double">Double</option>
        <option value="suite">Suite</option>
      </select>
      <button
        onClick={handleSearch}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Search
      </button>
    </div>
  );
};

export default SearchRooms;
