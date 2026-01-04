const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema(
  {
    originalFilename: { type: String, required: true , index: true },
    storedFilename: { type: String, required: true , index: true },
    publicUrl: { type: String, required: true , index: true },
    mimeType: { type: String, required: true , index: true },
    fileSize: { type: Number, required: true , index: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , index: true },
    expiryAt: { type: Date, default: null , index: true },
    // New fields to track expiry status explicitly
    isExpired: { type: Boolean, default: false , index: true },
    expiredAt: { type: Date, default: null , index: true },
    fileRemoved: { type: Boolean, default: false , index: true },
  },
  { timestamps: true ,  }
);

module.exports = mongoose.model('Content', ContentSchema);