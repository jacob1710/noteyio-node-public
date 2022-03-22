const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'User must have a name'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    unique: true,
  },
  firebaseId: {
    type: String,
    required: [true, 'User must have a firebaseId'],
  },
  otpKey: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
