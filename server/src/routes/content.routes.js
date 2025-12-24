const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { list, upload: uploadHandler } = require('../controllers/content.controller');

router.get('/', authenticateToken, list);
router.post('/upload', authenticateToken, upload.single('file'), uploadHandler);

module.exports = router;