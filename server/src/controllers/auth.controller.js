const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const jwtSecret = process.env.JWT_SECRET || 'dev_secret';

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ sub: user._id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '30m' });
  res.json({ token, user: { email: user.email, role: user.role } });
}

async function createUser(req, res) {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    const hash = await bcrypt.hash(password, 10);
    const doc = await User.create({
      name,
      email,
      passwordHash: hash,
      role: role === 'admin' ? 'admin' : 'user',
    });
    res.status(201).json({ id: doc._id, email: doc.email, role: doc.role });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user' });
  }
}

module.exports = { login, createUser };
