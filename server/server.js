require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seedCompanies = require('./seeds/companies');

// Import routes
const authRouter = require('./routes/auth');
const studentsRouter = require('./routes/students');
const roadmapRouter = require('./routes/roadmap');
const progressRouter = require('./routes/progress');
const dashboardRouter = require('./routes/dashboard');
const chatRouter = require('./routes/chat');
const companiesRouter = require('./routes/companies');
const drivesRouter = require('./routes/drives');
const applicationsRouter = require('./routes/applications');
const notificationsRouter = require('./routes/notifications');
const achievementsRouter = require('./routes/achievements');
const tpoRouter = require('./routes/tpo');
const seedRouter = require('./routes/seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/', (req, res) => {
  res.send('Placivio API is running! 🚀 Visit /api/health for status.');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Placivio API is running 🚀', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Placivio backend running' });
});

// Mount routes
app.use('/api/auth', authRouter);
app.use('/api/students', studentsRouter);
app.use('/api/roadmap', roadmapRouter);
app.use('/api/progress', progressRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/chat', chatRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/drives', drivesRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/achievements', achievementsRouter);
app.use('/api/tpo', tpoRouter);
app.use('/api/seed', seedRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

module.exports = app;
