const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { protect } = require('../middleware/authMiddleware');

// Room Search Route
router.post('/search', async (req, res) => {
  const { checkIn, checkOut, roomType } = req.body;

  if (!checkIn || !checkOut || !roomType) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const availableRooms = await Room.find({
      type: roomType,
      $nor: [
        {
          bookings: {
            $elemMatch: {
              checkIn: { $lt: checkOutDate },
              checkOut: { $gt: checkInDate },
            },
          },
        },
      ],
    });

    res.json(availableRooms);
  } catch (error) {
    console.error('Room search error:', error);
    res.status(500).json({ message: 'Server error while searching rooms' });
  }
});

// Book Room Route
router.post('/book', protect, async (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;

  if (!roomId || !checkIn || !checkOut) {
    return res.status(400).json({ message: 'All booking fields are required' });
  }

  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const isBooked = room.bookings.some((booking) => {
      return (
        checkInDate < booking.checkOut &&
        checkOutDate > booking.checkIn
      );
    });

    if (isBooked) {
      return res.status(409).json({ message: 'Room is already booked for these dates' });
    }

    room.bookings.push({ checkIn: checkInDate, checkOut: checkOutDate });
    await room.save();

    res.status(200).json({ message: 'Room booked successfully', room });
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
});

module.exports = router;
