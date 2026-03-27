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
/**
 * POST /api/auth/signup
 * Mock user registration/provisioning flow.
 */
async function signup(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    return res.status(201).json({
      success: true,
      message: 'User provisioned successfully',
      data: {
        user: { id: 'usr-' + Date.now(), email, role: 'analyst' },
        token: 'mock-jwt-token-newuser-2026'
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/reset-password
 * Mock password reset flow.
 */
async function resetPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    return res.status(200).json({
      success: true,
      message: `Password reset link sent to ${email}`,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Mock session verifier. Returns the active user.
 */
async function getMe(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      data: {
        id: 'admin-001',
        username: 'admin',
        role: 'admin',
        permissions: ['read', 'write', 'execute']
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { adminLogin, signup, resetPassword, getMe };
