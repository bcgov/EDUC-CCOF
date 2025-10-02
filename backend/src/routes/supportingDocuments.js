const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { saveDocument, getUploadedDocuments } = require('../components/supportingDocumentUpload');
const { scanFilePayload } = require('../util/clamav');

module.exports = router;

router.post('', passport.authenticate('jwt', { session: false }), isValidBackendToken, scanFilePayload, saveDocument);

router.get('/:applicationId', passport.authenticate('jwt', { session: false }), isValidBackendToken, getUploadedDocuments);
