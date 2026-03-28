// ODIP Intelligence - Dashboard Controller
// Summary counters, map points, alerts, scans
// Aligned with the ODIP frontend contract
// ──────────────────────────────────────────────

'use strict';

const { mockThreats, mockAlerts, mockScans } = require('../data/mockThreats');
const { getLeakIXThreats } = require('../services/leakix.service');

/**
 * GET /api/dashboard/summary (alias for /api/dashboard)
 */
async function getSummary(req, res, next) {
  try {
    const liveThreats = await getLeakIXThreats();
    const mapData = liveThreats.length > 0 ? liveThreats : mockThreats;

    let totalScore = 0;
    let hasCriticalRisk = false;

    mapData.forEach((t) => {
      totalScore += t.riskScore || 0;
      if (t.riskScore >= 90) hasCriticalRisk = true;
    });

    const averageRiskScore = mapData.length > 0 ? Math.round(totalScore / mapData.length) : 0;

    let systemStatus = 'System Status: Guarded';
    if (hasCriticalRisk || averageRiskScore >= 70) {
      systemStatus = 'System Status: Elevated Threat';
    }

    const highCount = mapData.filter(t => t.severity === 'high' || t.riskScore >= 80).length;
    const medCount = mapData.filter(t => t.severity === 'medium' || (t.riskScore >= 60 && t.riskScore < 80)).length;
    const lowCount = mapData.filter(t => t.severity === 'low' || t.riskScore < 60).length;

    const summary = {
      systemStatus:     systemStatus,
      averageRiskScore: averageRiskScore,
      exposedServices:  mapData.length,
      criticalIssues:   highCount,
      warnings:         medCount,
      assetsMonitored:  mapData.length + 5,
      protected:        mapData.length + 5 - highCount,
      totalThreats:     mapData.length,
      coveredLocations: [...new Set(mapData.map(t => t.city))],
    };

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/map-points
 */
async function getMapPoints(req, res, next) {
  try {
    const liveThreats = await getLeakIXThreats();
    return res.status(200).json({
      success: true,
      data: liveThreats.length > 0 ? liveThreats : mockThreats,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/alerts
 */
async function getAlerts(req, res, next) {
  try {
    const liveThreats = await getLeakIXThreats();
    const liveAlerts = liveThreats
      .filter(t => t.severity === 'high' || t.riskScore >= 80)
      .slice(0, 4)
      .map((t, index) => ({
        id: `ALT-ODIP-${index}`,
        severity: t.severity,
        title: t.threatType,
        ip: t.ipAddress,
        location: t.city,
        time: 'Just Now'
      }));

    return res.status(200).json({
      success: true,
      data: liveAlerts.length > 0 ? liveAlerts : mockAlerts,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/scans
 */
async function getScans(req, res, next) {
  try {
    const liveScans = [
      { id: `SCAN-ODIP-1.rw`, time: '1m ago', status: 'complete' },
      { id: `SCAN-ODIP-2.rw`, time: '15m ago', status: 'complete' },
      { id: `SCAN-ODIP-3.rw`, time: '1h ago', status: 'complete' }
    ];
    return res.status(200).json({
      success: true,
      data: liveScans,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary, getMapPoints, getAlerts, getScans };
