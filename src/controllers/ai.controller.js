// ──────────────────────────────────────────────
// AI Remediation Controller
// Accepts vulnerability JSON → returns 3 steps
// ──────────────────────────────────────────────

'use strict';

const { remediationSchema } = require('../utils/validators');
const { getRemediation } = require('../services/ai.service');

/**
 * POST /api/ai/remediation
 */
async function remediate(req, res, next) {
  try {
    const { error, value } = remediationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join('; '),
      });
    }

    const result = await getRemediation(value.vulnerability, value.language);

    // Response goes through maskIpMiddleware → IP auto-masked
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { remediate };
