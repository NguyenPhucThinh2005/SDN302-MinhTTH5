const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    default: "",
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
