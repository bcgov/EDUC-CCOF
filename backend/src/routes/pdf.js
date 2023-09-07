const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken= auth.isValidBackendToken();
const {getPdf, getPdfs } = require('../components/pdf');
const { param } = require('express-validator');

// special case this does not use frontend axios, so need to refresh here to handle expired jwt.
router.get('/getDocument/:annotationId', auth.refreshJWT,isValidBackendToken, [
  param('annotationId', 'URL param: [annotationId] is required').not().isEmpty()],  (req, res) => {
  return getPdf(req, res);
});

//Gets all the pdfs for summaryDeclaration and changeRequest submissions
router.get('/:applicationId', passport.authenticate('jwt', {session: false}, undefined),isValidBackendToken, [
  param('applicationId', 'URL param: [applicationId] is required').not().isEmpty()],  (req, res) => {
  return getPdfs(req, res);
});

module.exports = router;

