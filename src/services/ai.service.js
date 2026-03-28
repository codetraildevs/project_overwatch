// ──────────────────────────────────────────────
// AI Remediation Service
// Optimized for Hackathon Pitch Demo
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
    },
    'SQL Injection Vector': {
      riskLevel: 'Critical',
      explanation: 'An unparameterized query was detected in the data access layer, allowing potential database takeover.',
      recommendedFix: 'Use prepared statements for all database queries and deploy a WAF rule.',
      confidenceScore: 98,
    },
    'Open Port Exposure': {
      riskLevel: 'Medium',
      explanation: 'A non-standard port is open and responding with service banners.',
      recommendedFix: 'Apply firewall rules to restrict access to trusted IP ranges only.',
      confidenceScore: 88,
    },
    _default: {
      riskLevel: 'Medium',
      explanation: 'A potential security anomaly was detected on the target infrastructure.',
      recommendedFix: 'Isolate the affected asset and perform a thorough forensic audit.',
      confidenceScore: 85,
    },
  },

  rw: {
    'Phishing Domain': {
      riskLevel: 'Hanitse',
      explanation: 'Urubuga rwabonetse ruriho uburiganya bugenewe abakoresha MoMo mu Rwanda.',
      recommendedFix: 'Hagarika uyu muyoboro kuri DNS maze umenyeshe NCSA ako kanya.',
      confidenceScore: 95,
    },
    'SQL Injection Vector': {
      riskLevel: 'Komeye Cyane',
      explanation: 'Hari intege nke muri databaze zishobora gutuma umwanzi ayigarurira.',
      recommendedFix: 'Koresha uburyo bwa prepared statements mu kwinjira muri databaze.',
      confidenceScore: 98,
    },
    _default: {
      riskLevel: 'Iringaniye',
      explanation: 'Habonetse ikibazo kishobora guhungabanya umutekano w\'ikoranabuhanga.',
      recommendedFix: 'Tandukanya igikoresho cyagize ikibazo n\'umuyoboro maze ukore isuzuma.',
      confidenceScore: 85,
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
    `Analyze the following vulnerability and return a JSON object with exactly 4 fields in ${lang}:`,
    `1. "riskLevel": A single word rating (Critical, High, Medium, Low).`,
    `2. "explanation": A one-sentence clear explanation of the threat.`,
    `3. "recommendedFix": A one-sentence actionable technical fix.`,
    `4. "confidenceScore": An integer between 0 and 100 representing your certainty.`,
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
 * Generate remediation output via Gemini 2.0.
 */
async function getRemediation(vulnerability, language = 'en') {
  const prompt = buildRemediationPrompt(vulnerability, language);

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt
      });

      const text = response.text().trim();

      try {
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        if (parsed.riskLevel && parsed.explanation) {
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
