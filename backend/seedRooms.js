// backend/seedRooms.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./models/Room');
const connectDB = require('./config/db');

dotenv.config();

const seedRooms = async () => {
  await connectDB();
  await Room.deleteMany();

  const rooms = [
    { roomNumber: '101', type: 'Single', price: 100, bookings: [] },
    { roomNumber: '102', type: 'Double', price: 150, bookings: [] },
    { roomNumber: '201', type: 'Suite', price: 250, bookings: [] },
    { roomNumber: '202', type: 'Single', price: 100, bookings: [] },
    { roomNumber: '203', type: 'Double', price: 150, bookings: [] }
  ];

  await Room.insertMany(rooms);
  console.log('✅ Rooms seeded successfully!');
  process.exit();
};

seedRooms();
