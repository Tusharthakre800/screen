const path = require('path');
const Playlist = require('../../models/Playlist');

async function getActive(req, res) {
  const active = await Playlist.findOne({ isActive: true }).lean();
  if (!active) return res.json({ playlist: [] });

  const entries = Array.isArray(active.playlist) ? active.playlist : [];
  const ids = entries.map((e) => e.contentId).filter(Boolean);

  let contentMap = {};
  if (ids.length) {
    const Content = require('../../models/Content');
    const contents = await Content.find({ _id: { $in: ids } }).lean();
    contents.forEach((c) => { contentMap[c._id.toString()] = c; });
  }

  const now = Date.now();
  const enriched = entries
    .map((e) => {
      const c = e.contentId ? contentMap[e.contentId.toString()] : null;
      const expiryAt = c?.expiryAt;
      return {
        ...e,
        storedFilename: c?.storedFilename,
        publicUrl: c?.publicUrl,
        mimeType: c?.mimeType,
        expiryAt,
      };
    })
    .filter((item) => {
      const expMs = item.expiryAt ? new Date(item.expiryAt).getTime() : null;
      // keep only items that have a valid media URL and are not expired
      return item.publicUrl && (!expMs || expMs > now);
    });

  res.json({ ...active, playlist: enriched });
}

async function savePlaylist(req, res) {
  const { playlist } = req.body;
  if (!Array.isArray(playlist)) return res.status(400).json({ message: 'Invalid playlist' });
  await Playlist.updateMany({ isActive: true }, { $set: { isActive: false } });
  const created = await Playlist.create({ name: 'active', isActive: true, playlist });
  res.json({ ok: true, id: created._id });
}

function servePlayer(req, res) {
  // serve player.html from /public
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'player.html'));
}

module.exports = { getActive, savePlaylist, servePlayer };