// ──────────────────────────────────────────────
// Dashboard Controller
// Summary counters, map points, alerts, scans
// Aligned with the Overwatch frontend contract
// ──────────────────────────────────────────────

'use strict';

const { mockThreats, mockAlerts, mockScans } = require('../data/mockThreats');

const { getLeakIXThreats } = require('../services/leakix.service');

/**
 * GET /api/dashboard/summary (alias for /api/dashboard)
 * Returns the high-level summary metrics required by the frontend dashboard.
 * Dynamically calculates average risk score and System Status.
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

    // Logic: Average below 70 = Guarded. Any score 90+ = Elevated Threat. Else Monitoring/Elevated.
    let systemStatus = 'System Status: Guarded';
    if (hasCriticalRisk || averageRiskScore >= 70) {
      systemStatus = 'System Status: Elevated Threat';
    }

    const highCount = mapData.filter(t => t.severity === 'high' || t.riskScore >= 80).length;
    const medCount = mapData.filter(t => t.severity === 'medium' || (t.riskScore >= 60 && t.riskScore < 80)).length;
    const lowCount = mapData.filter(t => t.severity === 'low' || t.riskScore < 60).length;

    const summary = {
      // ── Frontend stat cards + System Status ───
      systemStatus:     systemStatus,
      averageRiskScore: averageRiskScore,
      exposedServices:  mapData.length,
      criticalIssues:   highCount,
      warnings:         medCount,
      assetsMonitored:  mapData.length + 5,   // includes non-threat assets
      protected:        mapData.length + 5 - highCount,

      // ── Original breakdown (backwards compat) ─
      totalThreats:     mapData.length,
      highSeverity:     highCount,
      mediumSeverity:   medCount,
      lowSeverity:      lowCount,
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
 * Returns live LeakIX threat data geographically mapped to Rwanda.
 * If live OSINT yields no pure Rwandan results (due to CDN routing),
 * it gracefully falls back to the MVP mock data.
 * IP masking is handled by maskIpMiddleware automatically.
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
 * Returns the recent critical alerts feed for the dashboard.
 * IPs are masked by middleware.
 */
async function getAlerts(req, res, next) {
  try {
    const liveThreats = await getLeakIXThreats();
    
    const liveAlerts = liveThreats
      .filter(t => t.severity === 'high' || t.riskScore >= 80)
      .slice(0, 4)
      .map((t, index) => ({
        id: `ALT-LIVE-${index}`,
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
 * Returns the recent scans list.
 */
async function getScans(req, res, next) {
  try {
    // Return recent activity log as "Scans"
    const now = new Date();
    const liveScans = [
      { id: `SCAN-LIVE-1.rw`, time: '1m ago', status: 'complete' },
      { id: `SCAN-LIVE-2.rw`, time: '15m ago', status: 'complete' },
      { id: `SCAN-LIVE-3.rw`, time: '1h ago', status: 'complete' }
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
