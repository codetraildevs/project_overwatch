// ──────────────────────────────────────────────
// AI Remediation Service (Mocked for MVP)
// Structured for future Gemini integration.
// ──────────────────────────────────────────────

'use strict';

const { deepMask } = require('../utils/maskIp');

// ── Mocked remediation responses ────────────
const MOCK_REMEDIATIONS = {
  en: {
    'Phishing Domain': [
      'Immediately block the identified phishing domain at the DNS and firewall level to prevent further user exposure.',
      'Deploy anti-phishing email gateway rules and notify all affected users to reset their credentials.',
      'Conduct a post-incident analysis and submit a report to the Rwanda NCSA for regulatory compliance.',
    ],
    'Open Port Exposure': [
      'Close all unnecessary open ports and restrict access using firewall allowlists limited to trusted IP ranges.',
      'Implement network segmentation to isolate the affected service from critical internal infrastructure.',
      'Schedule a recurring port-scan audit and integrate results into the continuous monitoring dashboard.',
    ],
    'Outdated SSL Certificate': [
      'Renew the SSL/TLS certificate immediately using a trusted Certificate Authority and enforce HTTPS-only access.',
      'Enable HSTS headers and configure automatic certificate renewal via ACME/Let\'s Encrypt.',
      'Audit all remaining domains for certificate expiry dates and set up automated alerting 30 days before expiration.',
    ],
    'SQL Injection Vector': [
      'Parameterize all database queries and remove any string-concatenated SQL from the application codebase.',
      'Deploy a Web Application Firewall (WAF) rule set tuned for SQL injection patterns.',
      'Conduct a full code review of data-access layers and remediate any additional injection vectors found.',
    ],
    'Weak Authentication': [
      'Enforce multi-factor authentication (MFA) for all user accounts, prioritising administrative roles.',
      'Implement account lockout policies and rate limiting on authentication endpoints to prevent brute-force attacks.',
      'Migrate password storage to bcrypt/argon2 hashing and require a minimum password complexity policy.',
    ],
    'Malware C2 Communication': [
      'Immediately isolate the compromised host from the network and block the C2 IP/domain at the perimeter firewall.',
      'Run a full forensic scan on the affected system, capture memory dumps, and preserve evidence for NCSA reporting.',
      'Rebuild the system from a known-clean image, rotate all associated credentials, and deploy EDR monitoring.',
    ],
    'DNS Misconfiguration': [
      'Correct the misconfigured DNS records and remove any dangling CNAME or wildcard entries that could be hijacked.',
      'Enable DNSSEC on all authoritative zones to prevent DNS spoofing and cache-poisoning attacks.',
      'Implement monitoring for unauthorized DNS changes and set up alerts for zone-transfer anomalies.',
    ],
    _default: [
      'Identify and isolate the affected asset to contain the threat and prevent lateral movement.',
      'Perform a thorough investigation, document findings, and apply the appropriate security patch or configuration fix.',
      'Report the incident to the Rwanda NCSA, update your threat model, and schedule a follow-up review.',
    ],
  },

  rw: {
    'Phishing Domain': [
      'Hagarika ako kanya k\'uburiganya ku rwego rwa DNS na firewall kugira ngo wirinde abakoresha kwinjiramo.',
      'Shyiraho amategeko yo gukumira uburiganya kuri email gateway kandi umenyeshe abakoresha bahuye n\'ikibazo gusubiramo ibanga ryabo.',
      'Kora isesengura ry\'icyabaye maze utange raporo ku Ikigo cy\'Igihugu gishinzwe Umutekano wa Murandasi (NCSA).',
    ],
    'Open Port Exposure': [
      'Funga uburabane (ports) budakenewe kandi ugabanyirize uburenganzira ukoresheje firewall ku mashami yemewe gusa.',
      'Shyiraho igice cy\'umuyoboro gitandukanya serivisi yahuye n\'ikibazo n\'ibikorwa by\'ingenzi.',
      'Teganya igenzura rya buri gihe ry\'uburabane kandi ubishyire mu gahunda y\'isuzuma rihoraho.',
    ],
    'SQL Injection Vector': [
      'Koresha ibipimo (parameters) mu bibazo byose bya databaze kandi ukureho SQL itunganijwe na string.',
      'Shyiraho Web Application Firewall (WAF) ifite amategeko yihariye yo kurwanya SQL injection.',
      'Kora isuzuma ry\'ikodi yose ijyanye no kwinjira muri databaze kandi ukosore ibibazo byose biboneka.',
    ],
    'Malware C2 Communication': [
      'Tangira utandukanye ikintu cyandujwe n\'umuyoboro maze uhagarike IP/domain ya C2 kuri firewall.',
      'Kora igenzura ryuzuye rya forensic, ufate amakuru yo mu bubiko bw\'itumanaho, kandi ubike ibimenyetso.',
      'Subira wubake sisitemu ukoresheje ishusho isukuye, uhindure ibanga ryose rijyanye, kandi ushyireho gahunda yo gukurikirana.',
    ],
    _default: [
      'Menya kandi utandukanye ibintu byahuye n\'ikibazo kugira ngo wirinde ikwirakwira ry\'ingorane.',
      'Kora ubushakashatsi bwimbitse, wandike ibisubizo, kandi ushyire mu bikorwa igisubizo cy\'umutekano cyangwa ihinduka rikwiye.',
      'Tanga raporo ku Ikigo cy\'Igihugu gishinzwe Umutekano wa Murandasi (NCSA) kandi utegure isuzuma rikurikiyeho.',
    ],
  },
};

/**
 * Build a prompt string for the AI model (Gemini in future).
 * IPs are masked BEFORE the prompt is created.
 */
function buildRemediationPrompt(vulnerability, language) {
  const masked = deepMask(vulnerability);
  const lang = language === 'rw' ? 'Kinyarwanda' : 'English';

  return [
    `You are a cybersecurity remediation expert for Rwandan FinTech infrastructure.`,
    `Analyse the following vulnerability and provide exactly 3 actionable remediation steps in ${lang}.`,
    ``,
    `Vulnerability details (masked for Zero-Trust compliance):`,
    `  City       : ${masked.city}`,
    `  Threat Type: ${masked.threatType}`,
    `  Severity   : ${masked.severity}`,
    `  Risk Score : ${masked.riskScore}`,
    `  IP Address : ${masked.ipAddress}`,
    ``,
    `Return ONLY 3 numbered steps. No preamble, no conclusion.`,
  ].join('\n');
}

/**
 * Generate mocked remediation output.
 * Future: replace body with a real Gemini API call using the prompt.
 */
async function getRemediation(vulnerability, language = 'en') {
  const prompt = buildRemediationPrompt(vulnerability, language);

  // ── Mocked response (swap for Gemini call later) ──
  const langPack = MOCK_REMEDIATIONS[language] || MOCK_REMEDIATIONS.en;
  const steps =
    langPack[vulnerability.threatType] || langPack._default;

  return {
    prompt,           // included for transparency / debugging
    language,
    threatType: vulnerability.threatType,
    remediationSteps: steps,
  };
}

module.exports = { getRemediation, buildRemediationPrompt };
