// ──────────────────────────────────────────────
// Vulnerabilities Controller
// In-memory storage for MVP
// ──────────────────────────────────────────────

'use strict';

const { mockThreats } = require('../data/mockThreats');
const { vulnerabilitySchema } = require('../utils/validators');

// In-memory store seeded with mock data
const vulnerabilities = [...mockThreats];
let nextId = mockThreats.length + 1;

/**
 * GET /api/vulnerabilities
 * IPs are masked automatically by the middleware.
 */
async function listVulnerabilities(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      count: vulnerabilities.length,
      data: vulnerabilities,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/vulnerabilities
 * Accepts new vulnerability data, validates, stores, and returns masked.
 */
async function createVulnerability(req, res, next) {
  try {
    const { error, value } = vulnerabilitySchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join('; '),
      });
    }

    const newVuln = { id: nextId++, ...value };
    vulnerabilities.push(newVuln);

    // Response goes through maskIpMiddleware → IP auto-masked
    return res.status(201).json({
      success: true,
      message: 'Vulnerability created',
      data: newVuln,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listVulnerabilities, createVulnerability };
