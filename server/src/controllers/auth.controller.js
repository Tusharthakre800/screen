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

module.exports = { login };