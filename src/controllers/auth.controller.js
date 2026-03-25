// ──────────────────────────────────────────────
// Auth Controller – Mocked admin login
// ──────────────────────────────────────────────

'use strict';

const { loginSchema } = require('../utils/validators');

/**
 * POST /api/auth/admin-login
 * Returns a mock token – no real auth for MVP.
 */
async function adminLogin(req, res, next) {
  try {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join('; '),
      });
    }

    // Mock credentials check (accept anything for MVP)
    return res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        user: {
          id: 'admin-001',
          username: req.body.username,
          role: 'admin',
        },
        token: 'mock-jwt-token-overwatch-2026',
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { adminLogin };
