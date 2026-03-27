// Auth routes

'use strict';

const { Router } = require('express');
const { adminLogin, signup, resetPassword, getMe } = require('../controllers/auth.controller');

const router = Router();

router.post('/admin-login', adminLogin);
router.post('/signup', signup);
router.post('/reset-password', resetPassword);
router.get('/me', getMe);

module.exports = router;
