const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken= auth.isValidBackendToken();
const { getNMFApplication, updateNMFApplication, createNMFApplication } = require('../components/nmfApplication');
const { param, validationResult, checkSchema} = require('express-validator');
const { log } = require('../components/logger');


router.get('/ccfri/:ccfriId/nmf', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('ccfriId', 'URL param: [ccfriId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return getNMFApplication(req, res);
  });

router.post('/ccfri/:ccfriId/nmf', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('ccfriId', 'URL param: [ccfriId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return createNMFApplication(req, res);
  });

router.put('/ccfri/nmf/:nmfpfiid', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('nmfpfiid', 'URL param: [nmfpfiid] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return updateNMFApplication(req, res);
  });

module.exports = router;

