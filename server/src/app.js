const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5174';
const { uploadsDir } = require('./middleware/upload');
const authRoutes = require('./routes/auth.routes');
const contentRoutes = require('./routes/content.routes');
const playerApiRoutes = require('./routes/player.api.routes');
const { servePlayer } = require('./controllers/player.controller');

const app = express();

app.use(cors({
  origin: clientOrigin,
  credentials: false,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
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