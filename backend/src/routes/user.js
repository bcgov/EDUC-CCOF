'use strict';

const passport = require('passport');
const express = require('express');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();

const { query, validationResult } = require('express-validator');

const { getUserInfo} = require('../components/user');
const log = require('../components/logger.js');


//JB - I left the below endpoint here in case the backend team decides to add another endpoint to the API. 

// router.get('/userProfile', passport.authenticate('jwt', {session: false}),isValidBackendToken, [
//   // query('criteria', 'query param: [criteria] is required').not().isEmpty(),
//   // query('criteria', 'must have minimum length 3').isLength({min: 3})
// ],

// (req, res) => {
//   //validationResult(req).throw();

//   log.info('howdy from user route');
//   return getProfile(req, res);
// });

router.get('/', passport.authenticate('jwt', {session: false}), isValidBackendToken, getUserInfo);




module.exports = router;
