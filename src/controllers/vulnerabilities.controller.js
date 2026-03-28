// ──────────────────────────────────────────────
// Vulnerabilities Controller
// In-memory storage for MVP
// ──────────────────────────────────────────────

'use strict';

const { getLeakIXThreats } = require('../services/leakix.service');

// In-memory store seeded with agent discoveries
const agentDiscoveries = [];
let nextId = 1000;

/**
 * GET /api/vulnerabilities
 */
async function listVulnerabilities(req, res, next) {
  try {
    const liveThreats = await getLeakIXThreats();
    
    // Combine live OSINT results with in-memory agent discoveries
    const allVulnerabilities = liveThreats.length > 0
      ? [...liveThreats, ...agentDiscoveries]
      : [...mockThreats, ...agentDiscoveries];

    return res.status(200).json({
      success: true,
      count: allVulnerabilities.length,
      data: allVulnerabilities,
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
