const log = require('../components/logger');
const { getRoles } = require('../components/lookup');

/**
 * Validates that the user has the specified permission.
 * @param {*} requiredPermissions
 * @returns
 */
module.exports = function (...requiredPermissions) {
  return async function (req, res, next) {
    log.verbose(`validating permission ${requiredPermissions}`);

    const userRole = req.session?.passport?.user?.role;

    if (!userRole) {
      return res.sendStatus(403);
    }

    const roles = await getRoles();
    const matchingRole = roles.find((role) => role.data.roleId === userRole.ofm_portal_roleid);
    const permissions = matchingRole ? matchingRole.data.permissions?.map((p) => p.permissionName) : [];

    const valid = requiredPermissions?.some((p) => permissions.includes(p));

    valid ? next() : res.sendStatus(403);
  };
};
