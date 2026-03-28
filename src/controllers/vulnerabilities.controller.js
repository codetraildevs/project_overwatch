// ODIP Intelligence - Vulnerabilities Controller
// Discovery in-memory store & Live integration
// ──────────────────────────────────────────────

'use strict';

const { mockThreats } = require('../data/mockThreats');
const { getLeakIXThreats } = require('../services/leakix.service');

// In-memory store for agent discoveries
const agentDiscoveries = [];
let nextId = 1000;

/**
 * GET /api/vulnerabilities
 */
async function listVulnerabilities(req, res, next) {
  try {
    const liveThreats = await getLeakIXThreats();
    
    // Combine live findings with manual agent discoveries
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
 */
async function createVulnerability(req, res, next) {
  try {
    // Basic assignment for Agent MVP
    const newVuln = { id: nextId++, ...req.body };
    agentDiscoveries.push(newVuln);

    return res.status(201).json({
      success: true,
      message: 'ODIP Agent discovery registered',
      data: newVuln,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listVulnerabilities, createVulnerability };
