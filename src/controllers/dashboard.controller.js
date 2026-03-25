// ──────────────────────────────────────────────
// Dashboard Controller
// Summary counters, map points, alerts, scans
// Aligned with the Overwatch frontend contract
// ──────────────────────────────────────────────

'use strict';

const { mockThreats, mockAlerts, mockScans } = require('../data/mockThreats');

/**
 * GET /api/dashboard/summary
 * Returns counters that match the frontend stat cards:
 *   exposedServices, criticalIssues, warnings, assetsMonitored, protected
 * Also includes the original threat breakdown for flexibility.
 */
async function getSummary(req, res, next) {
  try {
    const threats = mockThreats;

    const high   = threats.filter((t) => t.severity === 'high').length;
    const medium = threats.filter((t) => t.severity === 'medium').length;
    const low    = threats.filter((t) => t.severity === 'low').length;

    const summary = {
      // ── Frontend stat cards ─────────────────
      exposedServices:  threats.length,
      criticalIssues:   high,
      warnings:         medium,
      assetsMonitored:  threats.length + 5,   // includes non-threat assets
      protected:        threats.length + 5 - high,

      // ── Original breakdown (backwards compat) ─
      totalThreats:     threats.length,
      highSeverity:     high,
      mediumSeverity:   medium,
      lowSeverity:      low,
      coveredLocations: ['Kigali', 'Musanze', 'Rubavu'],
    };

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (err) {
    next(err);
  }
}

const { getLeakIXThreats } = require('../services/leakix.service');

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
    
    // Fallback to mock data if LeakIX returns no pure Rwandan IPs
    const mapData = liveThreats.length > 0 ? liveThreats : mockThreats;

    return res.status(200).json({
      success: true,
      data: mapData,
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
    return res.status(200).json({
      success: true,
      data: mockAlerts,
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
    return res.status(200).json({
      success: true,
      data: mockScans,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary, getMapPoints, getAlerts, getScans };
