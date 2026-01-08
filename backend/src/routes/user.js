'use strict';

const passport = require('passport');
const express = require('express');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getUserInfo } = require('../components/user');

router.get('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, getUserInfo);

// Validation is performed in the component to ensure that the user is registered in CRM
// and that only IDIR users can query other users.
router.get('/:queryUserName', passport.authenticate('jwt', { session: false }), isValidBackendToken, getUserInfo);

module.exports = router;
