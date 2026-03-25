// ──────────────────────────────────────────────
// Centralised Error Handler
// Returns a consistent { success, message } shape
// ──────────────────────────────────────────────

'use strict';

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error'
      : err.message || 'Internal server error';

  console.error(`[ERROR] ${req.method} ${req.originalUrl} – ${message}`);

  res.status(status).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
