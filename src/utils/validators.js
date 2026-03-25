// ──────────────────────────────────────────────
// Joi Validation Schemas
// Centralised request validation for all POST routes
// ──────────────────────────────────────────────

'use strict';

const Joi = require('joi');

// ── Allowed enumerations (Rwanda-only MVP) ──
const ALLOWED_CITIES      = ['Kigali', 'Musanze', 'Rubavu'];
const ALLOWED_SEVERITIES  = ['high', 'medium', 'low'];
const ALLOWED_LANGUAGES   = ['en', 'rw'];

// ── POST /api/auth/admin-login ──────────────
const loginSchema = Joi.object({
  username: Joi.string().trim().min(1).required(),
  password: Joi.string().trim().min(1).required(),
});

// ── POST /api/vulnerabilities ────────────────
const vulnerabilitySchema = Joi.object({
  city: Joi.string()
    .valid(...ALLOWED_CITIES)
    .required()
    .messages({ 'any.only': `city must be one of: ${ALLOWED_CITIES.join(', ')}` }),
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
  riskScore: Joi.number().integer().min(0).max(100).required(),
  threatType: Joi.string().trim().min(1).max(200).required(),
  ipAddress: Joi.string()
    .ip({ version: ['ipv4'] })
    .required(),
  severity: Joi.string()
    .valid(...ALLOWED_SEVERITIES)
    .required()
    .messages({ 'any.only': `severity must be one of: ${ALLOWED_SEVERITIES.join(', ')}` }),
});

// ── POST /api/ai/remediation ────────────────
const remediationSchema = Joi.object({
  vulnerability: Joi.object({
    city: Joi.string().valid(...ALLOWED_CITIES).required(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    riskScore: Joi.number().integer().min(0).max(100).required(),
    threatType: Joi.string().trim().min(1).required(),
    ipAddress: Joi.string().ip({ version: ['ipv4'] }).required(),
    severity: Joi.string().valid(...ALLOWED_SEVERITIES).required(),
  }).required(),
  language: Joi.string()
    .valid(...ALLOWED_LANGUAGES)
    .required()
    .messages({ 'any.only': `language must be one of: ${ALLOWED_LANGUAGES.join(', ')}` }),
});

module.exports = {
  loginSchema,
  vulnerabilitySchema,
  remediationSchema,
  ALLOWED_CITIES,
  ALLOWED_SEVERITIES,
  ALLOWED_LANGUAGES,
};
