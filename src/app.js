// ──────────────────────────────────────────────
// Express Application Setup
// ──────────────────────────────────────────────

'use strict';

const path    = require('path');
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const YAML    = require('yamljs');
const swaggerUi = require('swagger-ui-express');

// Middleware
const maskIpMiddleware = require('./middleware/maskIpMiddleware');
const errorHandler     = require('./middleware/errorHandler');

// Routes
const authRoutes            = require('./routes/auth.routes');
const dashboardRoutes       = require('./routes/dashboard.routes');
const vulnerabilitiesRoutes = require('./routes/vulnerabilities.routes');
const aiRoutes              = require('./routes/ai.routes');
const publicRoutes          = require('./routes/public.routes');
const dataRoutes            = require('./routes/data.routes');

// ── Create Express app ──────────────────────
const app = express();

// ── Global middleware ───────────────────────
app.use(helmet());

// Restrict CORS to specific authorized origins
const allowedOrigins = [
  'https://overwatch-ui-ob7z.vercel.app', // Eric's deployed Vercel UI
  'http://localhost:3000',                // Local development UI
  'https://project-overwatch.onrender.com' // Swagger UI Origin on Render
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy. Origin unauthorized.'));
    }
  },
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());

// Zero-Trust: mask IPs in every JSON response
app.use(maskIpMiddleware);

// ── Swagger UI ──────────────────────────────
const swaggerDoc = YAML.load(path.join(__dirname, '..', 'openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'ODIP Intelligence API Docs',
}));

// ── API routes ──────────────────────────────
app.use('/api/auth',            authRoutes);
app.use('/api/dashboard',       dashboardRoutes);
app.use('/api/vulnerabilities', vulnerabilitiesRoutes);
app.use('/api/ai',              aiRoutes);
app.use('/api/public',          publicRoutes);
app.use('/api',                 dataRoutes);

// Direct aliases requested by frontend MVP
const { getMapPoints } = require('./controllers/dashboard.controller');
app.get('/api/map', getMapPoints);

// ── Health check ────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'ODIP Intelligence API is running' });
});

// ── 404 handler ─────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Error handler (must be last) ────────────
app.use(errorHandler);

module.exports = app;
