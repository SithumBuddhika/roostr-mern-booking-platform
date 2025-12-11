// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: { type: String, required: true, minlength: 6 },

    role: {
      type: String,
      enum: ['customer', 'host', 'admin'],
      default: 'customer',
    },

    // Extra fields coming from Signup page
    idNumber: { type: String },       // ID field
    dateOfBirth: { type: String },    // "DD/MM/YYYY" for now
    phone: { type: String },          // phone number
    country: { type: String },        // Country / Region
  },
  { timestamps: true }
);

// 🔐 Hash password before save
// IMPORTANT: async hook WITHOUT `next`
userSchema.pre('save', async function () {
  // if password not changed, do nothing
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔑 Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
