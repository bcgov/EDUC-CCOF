const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getECEStaff, updateECEStaff } = require('../components/eceStaff');
const { UUID_VALIDATOR_VERSION } = require('../util/constants');
const { param, query, validationResult } = require('express-validator');
/**
 * Get the ECE Staff records using facilityID
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  //TODO: Add permissions here
  query('facilityId', 'Query param: [facilityId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
  (req, res) => {
    validationResult(req).throw();
    return getECEStaff(req, res);
  },
);

/**
 * Update an existing ECE Staff record using eceStaffId
 */
router.patch(
  '/:eceStaffId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  //TODO: Add permissions here
  [param('eceStaffId', 'URL param: [eceStaffId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return updateECEStaff(req, res);
  },
);

module.exports = router;
