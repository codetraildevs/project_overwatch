// Auth routes

'use strict';

const { Router } = require('express');
const { adminLogin } = require('../controllers/auth.controller');

const router = Router();

router.post('/admin-login', adminLogin);

module.exports = router;
