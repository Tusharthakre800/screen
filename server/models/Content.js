const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema(
  {
    originalFilename: { type: String, required: true },
    storedFilename: { type: String, required: true },
    publicUrl: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    expiryAt: { type: Date, default: null },
    // New fields to track expiry status explicitly
    isExpired: { type: Boolean, default: false },
    expiredAt: { type: Date, default: null },
    fileRemoved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Content', ContentSchema);