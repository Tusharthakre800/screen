const mongoose = require('mongoose');

const PlaylistEntrySchema = new mongoose.Schema(
  {
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true , index: true },
    type: { type: String, enum: ['video', 'image'], required: true , index: true },
    durationSec: { type: Number , index: true },
  },
  { _id: false }
);

const PlaylistSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'active' , index: true },
    isActive: { type: Boolean, default: true , index: true },
    playlist: { type: [PlaylistEntrySchema], default: [] , index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Playlist', PlaylistSchema);