// ──────────────────────────────────────────────
// IP-Masking Response Middleware – Zero-Trust
// Intercepts res.json() and deep-masks all IPs
// before anything reaches the frontend.
// ──────────────────────────────────────────────

'use strict';

const { deepMask } = require('../utils/maskIp');

/**
 * Wraps res.json() so that every outgoing JSON payload
 * has its IPv4 addresses masked automatically.
 */
function maskIpMiddleware(req, res, next) {
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    const masked = deepMask(body);
    return originalJson(masked);
  };

  next();
}

module.exports = maskIpMiddleware;
