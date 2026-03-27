// Dashboard routes

'use strict';

const { Router } = require('express');
const {
  getSummary,
  getMapPoints,
  getAlerts,
  getScans,
} = require('../controllers/dashboard.controller');

const router = Router();

router.get('/', getSummary);
router.get('/summary', getSummary);
router.get('/map-points', getMapPoints);
router.get('/alerts', getAlerts);
router.get('/scans', getScans);

module.exports = router;
