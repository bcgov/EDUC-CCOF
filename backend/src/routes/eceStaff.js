const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { createECEStaff, getECEStaff, getECEStaffCertificates, updateECEStaff } = require('../components/eceStaff');
const { UUID_VALIDATOR_VERSION } = require('../util/constants');
const { body, oneOf, query, validationResult } = require('express-validator');
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
 * Retrieves the list of certificates for a specific ECE staff member.
 */
router.get(
  '/certificates',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  //TODO: Add permissions here
  [
    oneOf([query('registrationNumber').notEmpty().matches(/^\d+$/), query('firstName').notEmpty().isString(), query('lastName').notEmpty().isString()], {
      message: 'URL query: [registrationNumber, firstName, or lastName] is required',
    }),
  ],
  (req, res) => {
    validationResult(req).throw();
    return getECEStaffCertificates(req, res);
  },
);

/**
 * Update an existing ECE Staff record
 */
router.patch(
  '/bulk',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  //TODO: Add permissions here
  body().isArray({ min: 1 }),
  (req, res) => updateECEStaff(req, res),
);

/**
 * Create a new ECE Staff record
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  //TODO: Add permissions here
  [body('facilityId').notEmpty().withMessage('[facilityId] is required').isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return createECEStaff(req, res);
  },
);

module.exports = router;
