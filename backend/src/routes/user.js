'use strict';

const passport = require('passport');
const express = require('express');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();

const { getUserInfo} = require('../components/user');

router.get('/', passport.authenticate('jwt', {session: false}), isValidBackendToken, getUserInfo);

router.get('/:queryUserName', passport.authenticate('jwt', {session: false}), isValidBackendToken, getUserInfo);

module.exports = router;
