// ODIP Intelligence - Data Controller
// Serves live OSINT data for Assets, Remediation, and Reports
// ──────────────────────────────────────────────

'use strict';

const { mockAssets, mockRemediationTasks, mockReports } = require('../data/mockThreats');
const { getLeakIXThreats } = require('../services/leakix.service');

/**
 * GET /api/assets
 */
async function getAssets(req, res, next) {
  try {
    const liveThreats = await getLeakIXThreats();
    const liveAssets = liveThreats.map((t, index) => ({
      id: `asset-odip-${index}`,
      name: t.threatType,
      type: 'Detected Exposure',
      status: 'monitored',
      location: t.city,
      ipAddress: t.ipAddress
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
 */
async function getRemediationTasks(req, res, next) {
  try {
    const liveThreats = await getLeakIXThreats();
    const liveTasks = liveThreats
      .filter(t => t.severity === 'high' || t.riskScore >= 80)
      .slice(0, 3)
      .map((t, index) => ({
        id: `rem-odip-${index}`,
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
 */
async function getReports(req, res, next) {
  try {
    const liveThreats = await getLeakIXThreats();
    const now = new Date();
    const liveReport = {
      id: `rep-odip-${now.getTime()}`,
      title: `ODIP National Exposure Audit - ${now.toLocaleDateString()}`,
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
