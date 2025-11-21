const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getLookupInfo } = require('../components/lookup');

router.get(
  '/lookup',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  // TODO #securitymatrix Validate that the user has a role
  (req, res) => {
    getLookupInfo(req, res);
  },
);

module.exports = router;
