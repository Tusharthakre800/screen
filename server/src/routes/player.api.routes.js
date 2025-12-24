const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { getActive, savePlaylist } = require('../controllers/player.controller');
const { ping, statuses } = require('../controllers/heartbeat.controller');

// Public: players can fetch active playlist
router.get('/', getActive);

// Admin: update active playlist
router.post('/playlist', authenticateToken, savePlaylist);

// Admin: view player statuses
router.get('/statuses', authenticateToken, statuses);

// Public: player heartbeat ping
router.post('/ping', ping);

module.exports = router;