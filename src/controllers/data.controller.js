// ──────────────────────────────────────────────
// Data Controller
// Serves mock data for Assets, Remediation, and Reports
// ──────────────────────────────────────────────

'use strict';

const { mockAssets, mockRemediationTasks, mockReports } = require('../data/mockThreats');

/**
 * GET /api/assets
 * Returns the mocked asset inventory.
 */
async function getAssets(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      data: mockAssets,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/remediation
 * Returns the mocked remediation task list.
 */
async function getRemediationTasks(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      data: mockRemediationTasks,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/reports
 * Returns the mocked generated report listing.
 */
async function getReports(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      data: mockReports,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAssets, getRemediationTasks, getReports };
