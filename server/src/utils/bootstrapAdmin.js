const bcrypt = require('bcryptjs');
const User = require('../../models/User');

async function bootstrapAdmin() {
  const mongoUri = process.env.MONGO_URI;
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!mongoUri) {
    console.warn('Skipping admin seed: no MONGO_URI set.');
    return;
  }
  const existing = await User.findOne({ email: adminEmail });
  const hash = await bcrypt.hash(adminPassword, 10);
  if (!existing) {
    await User.create({ name: 'Admin', email: adminEmail, passwordHash: hash, role: 'admin' });
    console.log(`Seeded admin user: ${adminEmail}`);
  } else {
    await User.updateOne({ _id: existing._id }, { $set: { role: 'admin', passwordHash: hash } });
    console.log(`Updated admin user credentials for: ${adminEmail}`);
  }
}

module.exports = { bootstrapAdmin };