const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getLookupInfo } = require('../components/lookup');
const validateRole = require('../middlewares/validateRole');

router.get('/lookup', passport.authenticate('jwt', { session: false }), isValidBackendToken, validateRole(), (req, res) => {
  getLookupInfo(req, res);
});

module.exports = router;
