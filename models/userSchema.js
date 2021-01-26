const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: 'pending',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
