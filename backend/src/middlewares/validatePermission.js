const HttpStatus = require('http-status-codes');
const log = require('../components/logger');
const { getRoles } = require('../components/lookup');

/**
 * Validates that the user has the specified permission.
 * @param {*} requiredPermissions
 * @returns
 */
module.exports = function (...requiredPermissions) {
  return async function (req, res, next) {
    log.verbose(`validating permissions ${requiredPermissions}`);

    // Reject deactivated users
    if (req.session?.passport?.user?.statecode === 1) {
      log.info('User is deactivated, responding with 401');
      return res.status(HttpStatus.UNAUTHORIZED).json();
    }

    const userRole = req.session?.passport?.user?.role;

    if (!userRole) {
      return res.sendStatus(403);
    }

    const roles = await getRoles();
    const matchingRole = roles.find((role) => role.data.roleNumber === userRole.roleNumber);

    const permissions = matchingRole ? matchingRole.data.permissions?.map((p) => p.permissionNumber) : [];

    const valid = requiredPermissions?.some((p) => permissions.includes(p));

    valid ? next() : res.sendStatus(403);
  };
};
