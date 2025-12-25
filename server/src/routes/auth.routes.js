const express = require('express');
const router = express.Router();
const { login, createUser } = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');

router.post('/login', login);
router.post('/users', authenticateToken, requireAdmin, createUser);

module.exports = router;
