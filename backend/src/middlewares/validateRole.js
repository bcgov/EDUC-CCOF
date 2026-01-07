const HttpStatus = require('http-status-codes');
const log = require('../components/logger');
const { isIdirUser } = require('../components/utils');

/**
 * Validates that the user has the specified role.
 * If no role is specified, just ensures that the user has a role.
 *
 * @param {*} role The role to validate.
 * @returns True if the user has the specified role, false otherwise.
 */
module.exports = function validateRole(role) {
  return async function (req, res, next) {
    log.verbose(`validating role ${role ?? 'exists'} `);

    // Always allow access for Ministry users
    if (isIdirUser(req)) {
      return next();
    }

    // Reject deactivated users
    if (req.session?.passport?.user?.statecode === 1) {
      log.info('User is deactivated, responding with 401');
      return res.status(HttpStatus.UNAUTHORIZED).json();
    }

    const userRole = req.session?.passport?.user?.role;
    if (!userRole) return res.sendStatus(403);

    // If a role was specified, validate it.
    // Otherwise just ensure that the user has a role.
    if (role) {
      userRole.roleNumber === role ? next() : res.sendStatus(403);
    } else {
      next();
    }
  };
};
