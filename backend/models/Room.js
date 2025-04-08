const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true }, // e.g., single, double, suite
  price: { type: Number, required: true },
  bookings: [
    {
      checkIn: { type: Date, required: true },
      checkOut: { type: Date, required: true },
    }
  ]
});

module.exports = mongoose.model('Room', roomSchema);
