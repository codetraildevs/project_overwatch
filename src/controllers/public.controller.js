// ──────────────────────────────────────────────
// Public API Controller
// Used by the future WhatsApp Bot
// ──────────────────────────────────────────────

'use strict';

const Joi = require('joi');
const { scanUrl } = require('../services/urlscan.service');

const scanSchema = Joi.object({
  url: Joi.string().uri().required(),
});

/**
 * POST /api/public/scan-link
 * Returns risk scoring and user-friendly warnings for MoMo phishing links.
 */
async function scanLink(req, res, next) {
  try {
    const { error, value } = scanSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'A valid URL is required.',
      });
    }

    const scanResult = await scanUrl(value.url);

    return res.status(200).json({
      success: true,
      data: scanResult,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { scanLink };
