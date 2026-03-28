// ──────────────────────────────────────────────
// Data Controller
// Serves mock data for Assets, Remediation, and Reports
// ──────────────────────────────────────────────

'use strict';

const { mockAssets, mockRemediationTasks, mockReports } = require('../data/mockThreats');
const { getLeakIXThreats } = require('../services/leakix.service');

/**
 * GET /api/assets
 * Returns the mocked asset inventory.
 */
async function getAssets(req, res, next) {
  try {
    const liveThreats = await getLeakIXThreats();
    
    // Convert threats to assets for the inventory view
    const liveAssets = liveThreats.map((t, index) => ({
      id: `asset-live-${index}`,
      name: t.threatType,
      type: 'Detected Exposure',
      status: 'monitored',
      location: t.city,
      ip: t.ipAddress
    }));

    return res.status(200).json({
      success: true,
      data: liveAssets.length > 0 ? liveAssets : mockAssets,
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
    const liveThreats = await getLeakIXThreats();
    
    // Take top 3 critical/high threats and convert to tasks
    const liveTasks = liveThreats
      .filter(t => t.severity === 'high' || t.riskScore >= 80)
      .slice(0, 3)
      .map((t, index) => ({
        id: `rem-live-${index}`,
        title: `Remediate ${t.threatType} on ${t.ipAddress}`,
        priority: t.severity,
        status: 'pending'
      }));

    return res.status(200).json({
      success: true,
      data: liveTasks.length > 0 ? liveTasks : mockRemediationTasks,
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
    const liveThreats = await getLeakIXThreats();
    
    // Generate a live report stub for the dashboard
    const now = new Date();
    const liveReport = {
      id: `rep-live-${now.getTime()}`,
      title: `National Exposure Audit - ${now.toLocaleDateString()}`,
      date: now.toISOString().split('T')[0],
      format: 'PDF',
      downloadUrl: '#',
      liveDataCount: liveThreats.length
    };

    return res.status(200).json({
      success: true,
      data: [liveReport, ...mockReports],
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAssets, getRemediationTasks, getReports };
