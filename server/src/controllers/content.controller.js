const Content = require('../../models/Content');

async function list(req, res) {
  try {
    const docs = await Content.find({}).sort({ createdAt: -1 }).lean();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list content' });
  }
}

async function upload(req, res) {
  const f = req.file;
  if (!f) return res.status(400).json({ message: 'No file uploaded' });
  const publicUrl = `/uploads/${f.filename}`;
  const { expiryAt } = req.body || {};
  try {
    const doc = await Content.create({
      originalFilename: f.originalname,
      storedFilename: f.filename,
      publicUrl,
      mimeType: f.mimetype,
      fileSize: f.size,
      uploader: req.user?.sub || null,
      expiryAt: expiryAt ? new Date(expiryAt) : null,
    });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save content' });
  }
}

module.exports = { list, upload };