// // backend/config/db.js
// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       // options not strictly required in latest mongoose but safe
//     });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (err) {
//     console.error('MongoDB connection error:', err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;


// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected:', conn.connection.host);

    // Run migration to set all rooms with 0 reviews to rating 0
    try {
      const Room = require("../models/Room");
      const result = await Room.updateMany(
        { $or: [{ reviewCount: 0 }, { reviewCount: { $exists: false } }] },
        { $set: { rating: 0 } }
      );
      console.log(`Migration: Set ratings of ${result.modifiedCount} unrated rooms to 0`);
    } catch (migErr) {
      console.error("Migration error:", migErr);
    }
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // If you prefer not to crash the app, comment out the next line.
    process.exit(1);
  }
};

module.exports = connectDB;
