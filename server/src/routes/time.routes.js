const express = require('express');
const router = express.Router();
/**
 * Return server time (UTC) in milliseconds and ISO string
 */
router.get('/', (req, res) => {
  const now = Date.now();
  res.json({ now, iso: new Date(now).toISOString() });
});

module.exports = router;
