// ──────────────────────────────────────────────
// Data Routes
// Maps core platform endpoints to mock controller
// ──────────────────────────────────────────────

'use strict';

const { Router } = require('express');
const { getAssets, getRemediationTasks, getReports } = require('../controllers/data.controller');

const router = Router();

router.get('/assets', getAssets);
router.get('/remediation', getRemediationTasks);
router.get('/reports', getReports);

module.exports = router;
