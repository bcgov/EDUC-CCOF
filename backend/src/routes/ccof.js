'use strict';

const passport = require('passport');
const express = require('express');
const { clearActiveSession, verifyRequest, downloadFile, uploadFile, deleteDocument, findPrimaryEdxActivationCode} = require('../components/secure');
const { forwardGetReq } = require('../components/utils');
const config = require('../config/index');
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/document-type-codes',
      '/file-requirements',
    ]
  });
});


router.post('/exchange/:id/documents', passport.authenticate('jwt', {session: false}), isValidBackendToken, [verifyRequest, uploadFile]);

router.get('/exchange/:id/documents', passport.authenticate('jwt', {session: false}), isValidBackendToken, verifyRequest,
  (req, res) => forwardGetReq(req, res, `${config.get('edx:exchangeURL')}/${req.params.id}/documents`)
);

router.get('/exchange/:id/documents/:documentId', passport.authenticate('jwt', {session: false}), isValidBackendToken, verifyRequest,
  (req, res) => forwardGetReq(req, res, `${config.get('edx:exchangeURL')}/${req.params.id}/documents/${req.params.documentId}`)
);
// special case this does not use frontend axios, so need to refresh here to handle expired jwt.
router.get('/exchange/:id/documents/:documentId/download/:fileName', auth.refreshJWT, isValidBackendToken, [verifyRequest, downloadFile]);

router.delete('/exchange/:id/documents/:documentId', passport.authenticate('jwt', {session: false}), isValidBackendToken, [verifyRequest, deleteDocument]);
router.get('/users/clearActiveUserSession', passport.authenticate('jwt', {session: false}, undefined), isValidBackendToken, clearActiveSession) ;
router.get('/users/user-schools/mincodes', passport.authenticate('jwt', {session: false}, undefined), isValidBackendToken,
  (req, res) => forwardGetReq(req, res,`${config.get('edx:rootURL')}/users/user-schools/mincodes`)
);
router.get('/users/activation-code/primary/:mincode', passport.authenticate('jwt', {session: false}, undefined), isValidBackendToken, findPrimaryEdxActivationCode);
router.get('/users/roles', passport.authenticate('jwt', {session: false}, undefined), isValidBackendToken, (req, res) => forwardGetReq(req, res,`${config.get('edx:rootURL')}/users/roles`));

module.exports = router;
