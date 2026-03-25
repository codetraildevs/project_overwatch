// AI routes

'use strict';

const { Router } = require('express');
const { remediate } = require('../controllers/ai.controller');

const router = Router();

router.post('/remediation', remediate);

module.exports = router;
