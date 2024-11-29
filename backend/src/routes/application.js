const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { deleteRfiApplication, getRFIMedian, getRFIApplication, createRFIApplication, updateRFIApplication } = require('../components/rfiApplication');
const { upsertParentFees, updateCCFRIApplication, deleteCCFRIApplication, renewCCOFApplication, getApplicationSummary, getChangeRequest, deletePcfApplication } = require('../components/application');
const {
  patchCCFRIApplication,
  getECEWEApplication,
  updateECEWEApplication,
  updateECEWEFacilityApplication,
  getApprovableFeeSchedules,
  getDeclaration,
  submitApplication,
  updateStatusForApplicationComponents,
} = require('../components/application');
const { getNMFApplication, updateNMFApplication, createNMFApplication } = require('../components/nmfApplication');
const { param, validationResult } = require('express-validator');

router.post('/renew-ccof', passport.authenticate('jwt', { session: false }), isValidBackendToken, [], (req, res) => {
  return renewCCOFApplication(req, res);
});

/* CREATE or UPDATE an existing CCFRI application for opt-in and out
  CCOF application guid and facility guid are defined in the payload
*/

router.get('/ccfri/:ccfriId/afs', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('ccfriId', 'URL param: [ccfriId] is required').notEmpty().isUUID()], (req, res) => {
  validationResult(req).throw();
  return getApprovableFeeSchedules(req, res);
});

router.get('/ccfri/:ccfriId/rfi', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('ccfriId', 'URL param: [ccfriId] is required').notEmpty().isUUID()], (req, res) => {
  validationResult(req).throw();
  return getRFIApplication(req, res);
});

router.post('/ccfri/:ccfriId/rfi', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('ccfriId', 'URL param: [ccfriId] is required').notEmpty().isUUID()], (req, res) => {
  validationResult(req).throw();
  return createRFIApplication(req, res);
});

router.put('/ccfri/rfi/:rfipfiid', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('rfipfiid', 'URL param: [rfipfiid] is required').notEmpty().isUUID()], (req, res) => {
  validationResult(req).throw();
  return updateRFIApplication(req, res);
});

router.get('/ccfri/:ccfriId/median', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('ccfriId', 'URL param: [ccfriId] is required').notEmpty().isUUID()], (req, res) => {
  validationResult(req).throw();
  return getRFIMedian(req, res);
});

router.delete('/ccfri/:ccfriId/rfi', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('ccfriId', 'URL param: [ccfriId] is required').notEmpty().isUUID()], (req, res) => {
  validationResult(req).throw();
  return deleteRfiApplication(req, res);
});

router.patch('/ccfri', passport.authenticate('jwt', { session: false }), isValidBackendToken, [], (req, res) => {
  //validationResult(req).throw();
  return updateCCFRIApplication(req, res);
});

router.patch('/ccfri/:ccfriId/', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('ccfriId', 'URL param: [ccfriId] is required').notEmpty().isUUID()], (req, res) => {
  validationResult(req).throw();
  return patchCCFRIApplication(req, res);
});

router.delete('/ccfri/:ccfriId/', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('ccfriId', 'URL param: [ccfriId] is required').notEmpty().isUUID()], (req, res) => {
  return deleteCCFRIApplication(req, res);
});

router.get('/ccfri/:ccfriId/nmf', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('ccfriId', 'URL param: [ccfriId] is required').notEmpty().isUUID()], (req, res) => {
  validationResult(req).throw();
  return getNMFApplication(req, res);
});

router.post('/ccfri/:ccfriId/nmf', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('ccfriId', 'URL param: [ccfriId] is required').notEmpty().isUUID()], (req, res) => {
  validationResult(req).throw();
  return createNMFApplication(req, res);
});

router.put('/ccfri/nmf/:nmfpfiid', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('nmfpfiid', 'URL param: [nmfpfiid] is required').notEmpty().isUUID()], (req, res) => {
  validationResult(req).throw();
  return updateNMFApplication(req, res);
});

/* CREATE or UPDATE parent fees for a specified age group and year.
  age group and year are defined in the payload
*/
router.patch('/parentfee', passport.authenticate('jwt', { session: false }), isValidBackendToken, [], (req, res) => {
  //validationResult(req).throw();
  return upsertParentFees(req, res);
});

/* Retrieve an ECEWE application for an application id. */
router.get(
  '/ecewe/:applicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('applicationId', 'URL param: [applicationId] is required').notEmpty().isUUID()],
  (req, res) => {
    return getECEWEApplication(req, res);
  },
);

/* Update an ECEWE applciation for an application id. */
router.patch(
  '/ecewe/:applicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('applicationId', 'URL param: [applicationId] is required').notEmpty().isUUID()],
  (req, res) => {
    return updateECEWEApplication(req, res);
  },
);

/* Update an ECEWE facility applciation for an ecewe application id. */
router.post(
  '/ecewe/facilities/:applicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('applicationId', 'URL param: [applicationId] is required').notEmpty().isUUID()],
  (req, res) => {
    return updateECEWEFacilityApplication(req, res);
  },
);

/* Get the user declaration for a given application id. */
router.get(
  '/declaration/:applicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('applicationId', 'URL param: [applicationId] is required').notEmpty().isUUID()],
  (req, res) => {
    return getDeclaration(req, res);
  },
);

/* Update Declaration for an CCOF/CCFRI/ECEWE application given an application id.  */
router.patch(
  '/declaration/submit/:applicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('applicationId', 'URL param: [applicationId] is required').notEmpty().isUUID()],
  (req, res) => {
    return submitApplication(req, res);
  },
);

/* Get the full summary of the application */
router.get(
  '/summary/:applicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('applicationId', 'URL param: [applicationId] is required').notEmpty().isUUID()],
  (req, res) => {
    return getApplicationSummary(req, res);
  },
);

router.put(
  '/status/:applicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('applicationId', 'URL param: [applicationId] is required').notEmpty().isUUID()],
  (req, res) => {
    validationResult(req).throw();
    return updateStatusForApplicationComponents(req, res);
  },
);

/*   Get existing change requests for an application */

router.get(
  '/changeRequest/:applicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('applicationId', 'URL param: [applicationId] is required').notEmpty().isUUID()],
  (req, res) => {
    return getChangeRequest(req, res);
  },
);

/* DELETE an existing PCF -- new PCF ONLY */

router.delete(
  '/:applicationId/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('applicationId', 'URL param: [applicationId] is required').notEmpty().isUUID()],
  (req, res) => {
    return deletePcfApplication(req, res);
  },
);

module.exports = router;
