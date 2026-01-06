const HttpStatus = require('http-status-codes');
const log = require('../components/logger');
const { isIdirUser } = require('../components/utils');

/**
 * Validates that the user is a Ministry user (IDIR account registered in CRM).
 * @returns True if the user is a Ministry user, false otherwise.
 */
module.exports = function () {
  return async function (req, res, next) {
    log.verbose('validating Ministry User');

    isIdirUser ? next() : res.sendStatus(HttpStatus.FORBIDDEN);
  };
};
