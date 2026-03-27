// ──────────────────────────────────────────────
// Mock Threat Seed Data – Rwanda only
// Covers Kigali, Musanze, and Rubavu
// ──────────────────────────────────────────────

'use strict';

const mockThreats = [
  // ── Kigali ──────────────────────────────────
  {
    id: 1,
    city: 'Kigali',
    lat: -1.9441,
    lng: 30.0619,
    riskScore: 92, // High
    threatType: 'Phishing Domain',
    ipAddress: '197.243.10.45',
    severity: 'high',
  },
  {
    id: 2,
    city: 'Kigali',
    lat: -1.9500,
    lng: 30.0588,
    riskScore: 65, // Medium
    threatType: 'Open Port Exposure',
    ipAddress: '197.243.12.101',
    severity: 'medium',
  },
  {
    id: 3,
    city: 'Kigali',
    lat: -1.9355,
    lng: 30.0820,
    riskScore: 45, // Low
    threatType: 'Outdated SSL Certificate',
    ipAddress: '197.243.14.200',
    severity: 'low',
  },

  // ── Musanze ─────────────────────────────────
  {
    id: 4,
    city: 'Musanze',
    lat: -1.4997,
    lng: 29.6346,
    riskScore: 78, // Medium
    threatType: 'SQL Injection Vector',
    ipAddress: '41.186.30.77',
    severity: 'high', // Keeping severity strings as requested by frontend mismatch previously, but updating internal score
  },
  {
    id: 5,
    city: 'Musanze',
    lat: -1.5050,
    lng: 29.6280,
    riskScore: 55, // Low
    threatType: 'Weak Authentication',
    ipAddress: '41.186.31.12',
    severity: 'medium',
  },

  // ── Rubavu ──────────────────────────────────
  {
    id: 6,
    city: 'Rubavu',
    lat: -1.7474,
    lng: 29.2743,
    riskScore: 90, // High
    threatType: 'Malware C2 Communication',
    ipAddress: '102.22.8.190',
    severity: 'high',
  },
  {
    id: 7,
    city: 'Rubavu',
    lat: -1.7400,
    lng: 29.2800,
    riskScore: 40, // Low
    threatType: 'DNS Misconfiguration',
    ipAddress: '102.22.9.33',
    severity: 'low',
  },
];

// ── Mock Alerts (matches frontend "Recent Critical Alerts") ──
const mockAlerts = [
  {
    id: 'ALT-001',
    severity: 'critical',
    title: 'SSH Service Exposed',
    ip: '192.168.1.42',
    location: 'Kigali District',
    time: '2 hours ago',
  },
  {
    id: 'ALT-002',
    severity: 'critical',
    title: 'RDP Port Open',
    ip: '10.10.5.88',
    location: 'Musanze',
    time: '3 hours ago',
  },
  {
    id: 'ALT-003',
    severity: 'warning',
    title: 'FTP Service Detected',
    ip: '172.16.8.55',
    location: 'Rwamagana',
    time: '5 hours ago',
  },
  {
    id: 'ALT-004',
    severity: 'warning',
    title: 'Outdated Apache Version',
    ip: '197.243.14.200',
    location: 'Kigali',
    time: '6 hours ago',
  },
];

// ── Mock Scans (matches frontend "Recent Scans") ──
const mockScans = [
  { id: 'scan-001.rw', time: '2m ago', status: 'complete' },
  { id: 'scan-002.rw', time: '10m ago', status: 'complete' },
  { id: 'scan-003.rw', time: '1h ago', status: 'complete' },
  { id: 'scan-004.rw', time: '2h ago', status: 'complete' },
];

module.exports = { mockThreats, mockAlerts, mockScans };
