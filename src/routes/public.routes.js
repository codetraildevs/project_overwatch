// Public routes

'use strict';

const { Router } = require('express');
const { scanLink } = require('../controllers/public.controller');

const router = Router();

router.post('/scan-link', scanLink);

module.exports = router;
