const fs = require('fs');
const path = require('path');
const Content = require('../../models/Content');
const Playlist = require('../../models/Playlist');
const { uploadsDir } = require('../middleware/upload');

async function purgeExpiredOnce() {
  const now = new Date();
  const expiredItems = await Content.find({ expiryAt: { $ne: null, $lte: now } }).lean();
  if (!expiredItems.length) return;

  for (const item of expiredItems) {
    try {
      // Remove from active playlists
      await Playlist.updateMany(
        { isActive: true },
        { $pull: { playlist: { contentId: item._id } } }
      );

      // Delete file from uploads
      const filePath = path.join(uploadsDir, item.storedFilename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Failed to delete file', filePath, e.message);
        }
      }

      // Remove DB record
      await Content.deleteOne({ _id: item._id });
      console.log(`Purged expired content: ${item.originalFilename}`);
    } catch (err) {
      console.error('Error purging expired content', item._id, err.message);
    }
  }
}

function startExpiryScheduler() {
  // Run every minute
  setInterval(() => {
    purgeExpiredOnce().catch((e) => console.error('Scheduler error', e.message));
  }, 60 * 1000);
  console.log('Expiry scheduler started (every 60s)');
}

module.exports = { startExpiryScheduler, purgeExpiredOnce };