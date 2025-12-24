require('dotenv').config();
const app = require('./src/app');
const { connectDb } = require('./src/config/db');
const { bootstrapAdmin } = require('./src/utils/bootstrapAdmin');
const port = process.env.PORT || 5000;

app.listen(port, async () => {
  try {
    await connectDb();
    await bootstrapAdmin();
  } catch (err) {
    console.error('Startup warning:', err.message);
  }
  console.log(`Server listening on http://localhost:${port}`);
});