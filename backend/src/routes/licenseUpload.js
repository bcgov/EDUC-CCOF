const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { saveLicenses, getLicenseFiles, deleteLicenseFiles } = require('../components/licenseUpload');

module.exports = router;

router.post('', passport.authenticate('jwt', { session: false }), isValidBackendToken, saveLicenses);

router.get('/:applicationId', passport.authenticate('jwt', { session: false }), isValidBackendToken, getLicenseFiles);

router.delete('', passport.authenticate('jwt', { session: false }), isValidBackendToken, deleteLicenseFiles);
