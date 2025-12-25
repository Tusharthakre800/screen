const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const frontendEnv = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const allowList = frontendEnv.split(',').map((s) => s.trim()).filter(Boolean);
const { uploadsDir } = require('./middleware/upload');
const authRoutes = require('./routes/auth.routes');
const contentRoutes = require('./routes/content.routes');
const playerApiRoutes = require('./routes/player.api.routes');
const { servePlayer } = require('./controllers/player.controller');

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowList.includes('*') || allowList.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// static uploads
app.use('/uploads', express.static(uploadsDir));

// API routers
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/player', playerApiRoutes);

// Player page
app.get('/player', servePlayer);

module.exports = app;
