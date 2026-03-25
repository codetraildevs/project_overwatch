// Vulnerabilities routes

'use strict';

const { Router } = require('express');
const {
  listVulnerabilities,
  createVulnerability,
} = require('../controllers/vulnerabilities.controller');

const router = Router();

router.get('/', listVulnerabilities);
router.post('/', createVulnerability);

module.exports = router;
