const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true , index: true },
    email: { type: String, required: true, unique: true , index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'admin'] , index: true },
  },
  { timestamps: true , index: true }
);

module.exports = mongoose.model('User', UserSchema);