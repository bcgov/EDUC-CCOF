const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken= auth.isValidBackendToken();
const { query, validationResult } = require('express-validator');

const { getProfile } = require('../components/userprofile');
const log = require('../components/logger.js');

//this is where query validation would be completed?

//passport.authenticate('jwt', {session: false}),isValidBackendToken,
// always seems to break when I try to authenticate 

router.get('/userProfile', passport.authenticate('jwt', {session: false}),isValidBackendToken, [
  // query('criteria', 'query param: [criteria] is required').not().isEmpty(),
  // query('criteria', 'must have minimum length 3').isLength({min: 3})
],

(req, res) => {
  //validationResult(req).throw();

  log.info('howdy from userprofile');
  return getProfile(req, res);
});



module.exports = router;
