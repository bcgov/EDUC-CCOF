const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken= auth.isValidBackendToken();
const { getRFIMedian, getRFIApplication, createRFIApplication, updateRFIApplication} = require('../components/rfiApplication');
const { upsertParentFees, updateCCFRIApplication, renewCCOFApplication, getApplicationSummary } = require('../components/application');
const { getECEWEApplication, updateECEWEApplication, updateECEWEFacilityApplication, getCCFRIApplication, getDeclaration, submitApplication} = require('../components/application');
const { getNMFApplication, updateNMFApplication, createNMFApplication } = require('../components/nmfApplication');
const { param, validationResult } = require('express-validator');

router.post('/renew-ccof', passport.authenticate('jwt', {session: false}),isValidBackendToken, [],  (req, res) => {
  return renewCCOFApplication(req, res);
});

/* CREATE or UPDATE an existing CCFRI application for opt-in and out
  CCOF application guid and facility guid are defined in the payload
*/
router.get('/ccfri/:ccfriId', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('ccfriId', 'URL param: [ccfriId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return getCCFRIApplication(req, res);
  });

router.get('/ccfri/:ccfriId/rfi', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('ccfriId', 'URL param: [ccfriId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return getRFIApplication(req, res);
  });

router.post('/ccfri/:ccfriId/rfi', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('ccfriId', 'URL param: [ccfriId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return createRFIApplication(req, res);
  });

router.put('/ccfri/rfi/:rfipfiid', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('rfipfiid', 'URL param: [rfipfiid] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return updateRFIApplication(req, res);
  });

router.get('/ccfri/:ccfriId/median', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('ccfriId', 'URL param: [ccfriId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return getRFIMedian(req, res);
  });

router.patch('/ccfri', passport.authenticate('jwt', {session: false}),isValidBackendToken, [],  (req, res) => {
  //validationResult(req).throw();
  //console.log(req.bpdy);
  return updateCCFRIApplication(req, res);
});

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

/* CREATE or UPDATE parent fees for a specified age group and year. 
  age group and year are defined in the payload   
*/
router.patch('/parentfee', passport.authenticate('jwt', {session: false}),isValidBackendToken, [],  (req, res) => {
  //validationResult(req).throw();
  //console.log(req.bpdy);
  return upsertParentFees(req, res);
});


/* Retrieve an ECEWE application for an application id. */
router.get('/ecewe/:applicationId', passport.authenticate('jwt', {session: false}),isValidBackendToken, (req, res) => {
  return getECEWEApplication(req, res);
});

/* Update an ECEWE applciation for an application id. */
router.patch('/ecewe/:applicationId', passport.authenticate('jwt', {session: false}),isValidBackendToken, [
  param('applicationId', 'URL param: [applicationId] is required').not().isEmpty()],  (req, res) => {
  return updateECEWEApplication(req, res);
});

/* Update an ECEWE facility applciation for an ecewe application id. */
router.post('/ecewe/facilities/:applicationId', passport.authenticate('jwt', {session: false}),isValidBackendToken, [
  param('applicationId', 'URL param: [applicationId] is required').not().isEmpty()],  (req, res) => {
  return updateECEWEFacilityApplication(req, res);
});

/* Get the user declaration for a given application id. */
router.get('/declaration/:applicationId', passport.authenticate('jwt', {session: false}),isValidBackendToken, (req, res) => {
  return getDeclaration(req, res);
});

/* Update Declaration for an CCOF/CCFRI/ECEWE application given an application id.  */
router.patch('/declaration/submit/:applicationId', passport.authenticate('jwt', {session: false}),isValidBackendToken, [
  param('applicationId', 'URL param: [applicationId] is required').not().isEmpty()],  (req, res) => {
  return submitApplication(req, res);
});

/* Get the full summary of the application */
router.get('/summary/:applicationId', passport.authenticate('jwt', {session: false}),isValidBackendToken, [
  param('applicationId', 'URL param: [applicationId] is required').not().isEmpty()],  (req, res) => {
  return getApplicationSummary(req, res);
});

module.exports = router;

