const mongoose = require('mongoose');

const PlaylistEntrySchema = new mongoose.Schema(
  {
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    type: { type: String, enum: ['video', 'image'], required: true },
    durationSec: { type: Number },
  },
  { _id: false }
);

const PlaylistSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'active' },
    isActive: { type: Boolean, default: true },
    playlist: { type: [PlaylistEntrySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Playlist', PlaylistSchema);