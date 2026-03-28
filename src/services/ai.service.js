// ──────────────────────────────────────────────
// AI Remediation Service
// Optimized for Hackathon Pitch Demo
// Hybrid Insight Engine (Summary + Detailed Steps)
// ──────────────────────────────────────────────

'use strict';

const { GoogleGenAI } = require('@google/genai');
const { deepMask } = require('../utils/maskIp');

// ── Gemini Initialization ────────────────────
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

// ── Mocked remediation responses (Demo Fallback) ──
const MOCK_REMEDIATIONS = {
  en: {
    'Phishing Domain': {
      riskLevel: 'High',
      explanation: 'The identified domain is hosting a phishing page targeting local MoMo users.',
      recommendedFix: 'Immediately block the domain at the DNS level and notify the Rwanda NCSA.',
      confidenceScore: 95,
      remediationSteps: [
        'Block the malicious domain at the organization perimeter firewall and DNS resolvers.',
        'Issue an urgent security advisory to all employees regarding the specific phishing campaign.',
        'Report the phishing URL to the Rwanda NCSA (ncsa.gov.rw) for nationwide take-down.'
      ]
    },
    'SQL Injection Vector': {
      riskLevel: 'Critical',
      explanation: 'An unparameterized query was detected in the data access layer, allowing potential database takeover.',
      recommendedFix: 'Use prepared statements for all database queries and deploy a WAF rule.',
      confidenceScore: 98,
      remediationSteps: [
        'Immediately refactor the affected code to use parameterized queries (Prepared Statements).',
        'Enable a Web Application Firewall (WAF) rule specifically for SQL Injection patterns.',
        'Conduct a full database audit to check for any unauthorized data exfiltration or modification.'
      ]
    },
    'Open Port Exposure': {
      riskLevel: 'Medium',
      explanation: 'A non-standard port is open and responding with service banners.',
      recommendedFix: 'Apply firewall rules to restrict access to trusted IP ranges only.',
      confidenceScore: 88,
      remediationSteps: [
        'Close the unnecessary port if the service is not required for production.',
        'Restrict access to the port using an IP whitelist limited to internal management IPs.',
        'Ensure the service running on the port is updated to the latest secure version.'
      ]
    },
    _default: {
      riskLevel: 'Medium',
      explanation: 'A potential security anomaly was detected on the target infrastructure.',
      recommendedFix: 'Isolate the affected asset and perform a thorough forensic audit.',
      confidenceScore: 85,
      remediationSteps: [
        'Isolate the target system from the internal network to prevent lateral movement.',
        'Perform a deep forensic scan of the system logs and active processes.',
        'Report the incident to the internal security team and the Rwanda NCSA.'
      ]
    },
  },

  rw: {
    'Phishing Domain': {
      riskLevel: 'Hanitse',
      explanation: 'Urubuga rwabonetse ruriho uburiganya bugenewe abakoresha MoMo mu Rwanda.',
      recommendedFix: 'Hagarika uyu muyoboro kuri DNS maze umenyeshe NCSA ako kanya.',
      confidenceScore: 95,
      remediationSteps: [
        'Hagarika ako kanya uyu muyoboro ukoresheje firewall na DNS resolvers.',
        'Menyesha abakozi bose ibyerekeye ubu buriganya bwa MoMo kugira ngo babe maso.',
        'Tanga raporo ku Ikigo cy\'Igihugu gishinzwe Umutekano wa Murandasi (NCSA) kugira ngo uyu muyoboro ufungwe mu gihugu hose.'
      ]
    },
    'SQL Injection Vector': {
      riskLevel: 'Komeye Cyane',
      explanation: 'Hari intege nke muri databaze zishobora gutuma umwanzi ayigarurira.',
      recommendedFix: 'Koresha uburyo bwa prepared statements mu kwinjira muri databaze.',
      confidenceScore: 98,
      remediationSteps: [
        'Hindura ikodi ako kanya ukoresheje parameterized queries mu mwanya w\'uburyo bwa kera.',
        'Shyiraho Web Application Firewall (WAF) ifite amategeko yo guhagarika SQL injection.',
        'Kora isuzuma ryuzuye rya databaze kugira ngo urere niba hari amakuru yaba yibwe cyangwa yahinduwe.'
      ]
    },
    _default: {
      riskLevel: 'Iringaniye',
      explanation: 'Habonetse ikibazo kishobora guhungabanya umutekano w\'ikoranabuhanga.',
      recommendedFix: 'Tandukanya igikoresho cyagize ikibazo n\'umuyoboro maze ukore isuzuma.',
      confidenceScore: 85,
      remediationSteps: [
        'Tandukanya ako kanya igikoresho cyagize ikibazo n\'umuyoboro w\'imbere.',
        'Kora isuzuma ryimbitse ry\'amakuru (logs) na processes ziri gukora kuri sisitemu.',
        'Tanga raporo kuri NCSA kandi ukomeze gukurikirana ibindi bishobora kubaho.'
      ]
    },
  },
};

/**
 * Build a prompt string for the AI model (Gemini).
 */
function buildRemediationPrompt(vulnerability, language) {
  const masked = deepMask(vulnerability);
  const lang = language === 'rw' ? 'Kinyarwanda' : 'English';

  return [
    `You are a senior cybersecurity expert specialized in Rwandan FinTech.`,
    `Analyze the following vulnerability and return a JSON object with exactly 5 fields in ${lang}:`,
    `1. "riskLevel": A single word rating (Critical, High, Medium, Low).`,
    `2. "explanation": A one-sentence clear explanation of the threat.`,
    `3. "recommendedFix": A one-sentence actionable technical fix.`,
    `4. "confidenceScore": An integer between 0 and 100.`,
    `5. "remediationSteps": A JSON array of exactly 3 detailed strings providing a step-by-step action plan.`,
    ``,
    `Vulnerability:`,
    `  Target: ${masked.ipAddress} (${masked.city})`,
    `  Type: ${masked.threatType}`,
    `  Severity: ${masked.severity}`,
    `  Current Risk: ${masked.riskScore}/100`,
    ``,
    `Return ONLY valid JSON. No Markdown formatting. No preamble.`,
  ].join('\n');
}

/**
 * Generate remediation output via Gemini.
 */
async function getRemediation(vulnerability, language = 'en') {
  const prompt = buildRemediationPrompt(vulnerability, language);

  if (ai) {
    try {
      // Using gemini-2.0-flash which is confirmed to exist
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt
      });

      const text = response.text().trim();

      try {
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        if (parsed.riskLevel && parsed.remediationSteps) {
          return {
            ...parsed,
            source: 'Gemini AI (Insight)'
          };
        }
      } catch (e) {
        console.warn('DEBUG: JSON parse failed, text was:', text);
      }
    } catch (error) {
       console.error('❌ Gemini API Error:', error.message);
    }
  }

  // ── Fallback ──────────────────
  const langPack = MOCK_REMEDIATIONS[language] || MOCK_REMEDIATIONS.en;
  const mockData = langPack[vulnerability.threatType] || langPack._default;

  return {
    ...mockData,
    source: 'Mock (Fallback)'
  };
}

module.exports = { getRemediation, buildRemediationPrompt };
