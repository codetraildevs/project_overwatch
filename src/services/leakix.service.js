// ──────────────────────────────────────────────
// LeakIX Integration Service
// Fetches, normalizes, and masks raw LeakIX intel
// ──────────────────────────────────────────────

'use strict';

const axios = require('axios');
const { maskIp } = require('../utils/maskIp');

const LEAKIX_API_KEY = process.env.LEAKIX_API_KEY;
const BASE_URL       = 'https://leakix.net';

// Hardcoded coordinates for Rwandan map points (per MVP requirements)
const RWANDA_COORDS = {
  'Kigali':  { lat: -1.9441, lng: 30.0619 },
  'Musanze': { lat: -1.4998, lng: 29.6342 },
  'Rubavu':  { lat: -1.6792, lng: 29.2589 },
};

/** Mock a risk score between 60-90 purely for MVP visualization */
function calculateRiskScore(ip) {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    hash = ip.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 60 + (Math.abs(hash) % 31);
}

/** Severity rules */
function determineSeverity(score) {
  if (score >= 80) return 'high';
  if (score >= 70) return 'medium';
  return 'low';
}

/** Normalize and map raw LeakIX leak data to standard threat structure */
function normalizeLeakIX(item, index) {
  const ip = item.ip || '0.0.0.0';
  const riskScore = calculateRiskScore(ip);
  const city = item.geoip?.city_name || 'Kigali'; 
  
  // Assign exact mapped coordinates if known city, otherwise fallback to Kigali
  const coords = RWANDA_COORDS[city] || RWANDA_COORDS['Kigali'];

  // Extract critical leak details (e.g. "Git configuration and history exposed")
  const leakType = item.leak?.type || item.plugin || 'Critical Exposure Detected';

  return {
    id: index + 1000, 
    city: city,
    lat: coords.lat,
    lng: coords.lng,
    riskScore: riskScore,
    threatType: leakType, // Passing the exact leak string to Eric's payload
    ipAddress: maskIp(ip),
    severity: item.leak?.severity || determineSeverity(riskScore), // Prefer LeakIX severity if present
  };
}

/**
 * Fetch HTTP services from LeakIX (targeting Rwanda/East Africa)
 * Return standardized, masked threat objects.
 */
async function getLeakIXThreats() {
  if (!LEAKIX_API_KEY) {
    console.warn('⚠️ LEAKIX_API_KEY missing, skipping live fetch.');
    return [];
  }

  try {
    // Hunting for high-severity leaks like .git directory exposures
    const query = encodeURIComponent('country:"RW" severity:"critical"');
    const url   = `${BASE_URL}/search?scope=leak&q=${query}`;

    const response = await axios.get(url, {
      headers: {
        'Accept':  'application/json',
        'api-key': LEAKIX_API_KEY,
      },
      timeout: 5000 
    });

    if (!Array.isArray(response.data)) return [];

    // Filter strictly for Rwandan resolution, normalize and mask
    const rwandanResults = response.data
      .filter((item) => item.geoip?.country_iso_code === 'RW' || item.geoip?.country_name === 'Rwanda')
      .map(normalizeLeakIX);

    return rwandanResults;
  } catch (err) {
    console.error(`❌ LeakIX Service Error: ${err.message}`);
    return [];
  }
}

module.exports = { getLeakIXThreats };
