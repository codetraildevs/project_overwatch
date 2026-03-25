// ──────────────────────────────────────────────
// URLScan Simulation Service
// Powers the public WhatsApp Phishing Scanner MVP
// ──────────────────────────────────────────────

'use strict';

/**
 * Simulate scanning a URL (mocking urlscan.io).
 * Determines safety, risk score, messaging and recommendations based on pattern matching.
 */
async function scanUrl(url) {
  // Simulate network delay for realism
  await new Promise((resolve) => setTimeout(resolve, 800));

  const lowerUrl = url.toLowerCase();

  // Pattern 1: High Risk (Smishing / Typosquatting examples)
  if (lowerUrl.includes('free-money') || lowerUrl.includes('momo-bonus') || lowerUrl.includes('win.rw')) {
    return {
      url,
      safe: false,
      riskScore: 95,
      detectedThreatType: 'Phishing Campaign',
      warningMessage: '🚨 DANGER: This looks like a MoMo smishing link designed to steal your PIN.',
      recommendation: 'Do NOT click the link. Delete the message and report the sender to MTN Rwanda (100).',
    };
  }

  // Pattern 2: Medium Risk (Unknown or suspicious TLDs, IP URLs)
  if (lowerUrl.includes('.xyz') || lowerUrl.includes('.tk') || /^\d+\.\d+\.\d+\.\d+/.test(lowerUrl)) {
    return {
      url,
      safe: false,
      riskScore: 65,
      detectedThreatType: 'Suspicious Domain',
      warningMessage: '⚠️ WARNING: This domain is unverified and often used for spam.',
      recommendation: 'Avoid entering personal details. Only use official corporate websites.',
    };
  }

  // Pattern 3: Low Risk (Trusted domains like gov.rw, mtn.co.rw)
  if (lowerUrl.includes('gov.rw') || lowerUrl.includes('mtn.co.rw') || lowerUrl.includes('bk.rw')) {
    return {
      url,
      safe: true,
      riskScore: 5,
      detectedThreatType: 'None',
      warningMessage: '✅ SAFE: This is a verified, official domain.',
      recommendation: 'You may proceed safely.',
    };
  }

  // Default Fallback
  return {
    url,
    safe: true,
    riskScore: 15,
    detectedThreatType: 'Uncategorized',
    warningMessage: 'ℹ️ INFO: No specific threats detected, but always remain vigilant.',
    recommendation: 'Ensure the website uses HTTPS before entering any data.',
  };
}

module.exports = { scanUrl };
