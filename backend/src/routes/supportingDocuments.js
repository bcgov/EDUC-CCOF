const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const {saveDocument, getUploadedDocuments, deleteUploadedDocuments} = require('../components/supportingDocumentUpload');

module.exports = router;

router.post('', passport.authenticate('jwt', {session: false}), isValidBackendToken, saveDocument);

router.get('/:applicationId', passport.authenticate('jwt', {session: false}), isValidBackendToken, getUploadedDocuments);

router.delete('', passport.authenticate('jwt', {session: false}), isValidBackendToken, deleteUploadedDocuments);

