// ──────────────────────────────────────────────
// IP Masking Utility – Zero-Trust Pipeline
// Masks the last octet of any IPv4 address
// ──────────────────────────────────────────────

'use strict';

const IPV4_REGEX = /\b(\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}\b/g;

/**
 * Mask a single IPv4 string.
 * "197.243.10.45" → "197.243.10.XXX"
 */
function maskIp(ip) {
  if (typeof ip !== 'string') return ip;
  return ip.replace(IPV4_REGEX, '$1.XXX');
}

/**
 * Recursively walk any JSON-serializable value and mask every
 * IPv4 address found in string values or string keys.
 */
function deepMask(value) {
  if (value === null || value === undefined) return value;

  if (typeof value === 'string') return maskIp(value);

  if (Array.isArray(value)) return value.map(deepMask);

  if (typeof value === 'object') {
    const masked = {};
    for (const [k, v] of Object.entries(value)) {
      masked[k] = deepMask(v);
    }
    return masked;
  }

  return value; // numbers, booleans, etc.
}

module.exports = { maskIp, deepMask };
