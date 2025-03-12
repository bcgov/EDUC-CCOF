const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { findAddresses } = require('../components/canadaPost');
const { oneOf, query, validationResult } = require('express-validator');

module.exports = router;

router.get(
  '/find',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  oneOf([query('searchTerm').notEmpty(), query('lastId').notEmpty()], {
    message: 'URL query: [searchTerm or lastId] is required',
  }),
  (req, res) => {
    validationResult(req).throw();
    return findAddresses(req, res);
  },
);

module.exports = router;
