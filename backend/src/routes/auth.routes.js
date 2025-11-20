// backend/src/routes/auth.routes.js
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', passport.authenticate('local'), // nếu fail sẽ trả 401
authController.loginSuccess);

// GET /api/auth/me
router.get('/me', authController.getMe);

// POST /api/auth/logout
router.post('/logout', authController.logout);

module.exports = router;
