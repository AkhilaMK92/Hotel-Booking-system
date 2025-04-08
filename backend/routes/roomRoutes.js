const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/authMiddleware');

// 🔍 Search available rooms
router.post('/search', protect, async (req, res) => {
  const { checkIn, checkOut, roomType } = req.body;

  try {
    const rooms = await Room.find({ type: roomType });
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const availableRooms = rooms.filter((room) =>
      room.bookings.every((booking) =>
        checkOutDate <= booking.checkIn || checkInDate >= booking.checkOut
      )
    );

    res.json(availableRooms);
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ message: 'Failed to search rooms' });
  }
});

// 💳 Book a room (simulate payment)
router.post('/book', protect, async (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;

  if (!roomId || !checkIn || !checkOut) {
    return res.status(400).json({ message: 'Missing booking information' });
  }

  try {
    const room = await Room.findById(roomId);
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Check for overlaps
    const isBooked = room.bookings.some(b =>
      checkInDate < b.checkOut && checkOutDate > b.checkIn
    );

    if (isBooked) {
      return res.status(409).json({ message: 'Room already booked for these dates' });
    }

    // Update Room's bookings
    room.bookings.push({ checkIn: checkInDate, checkOut: checkOutDate, user: req.user.id });
    await room.save();

    // Save to Booking history
    await Booking.create({
      user: req.user.id,
      room: room._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
    });

    res.status(200).json({ message: 'Room booked successfully' });
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
});

// 📜 Get booking history for current user
router.get('/history', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('room');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking history' });
  }
});

module.exports = router;
