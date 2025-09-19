const HttpStatus = require('http-status-codes');
const log = require('../components/logger');
const { getRoles } = require('../components/lookup');
const { PERMISSIONS } = require('../util/constants');

module.exports = {
  /**
   * Validates that the user has the specified permission.
   * @param {*} requiredPermissions
   * @returns
   */
  validateUserHasPermissions(...requiredPermissions) {
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
  },
  async validateUserCanEditOther(req, res, next) {
    const currentUser = req.session?.passport?.user;
    const targetContactId = req.params.contactId;
    log.verbose('Checking if user can edit self or others');

    const roles = await getRoles();
    const matchingRole = roles.find((role) => role.data.roleNumber === currentUser.role.roleNumber);
    const permissions = matchingRole?.data?.permissions?.map((p) => p.permissionNumber) || [];

    const canEditUsers = permissions.includes(PERMISSIONS.EDIT_USERS);
    const canUpdateSelf = permissions.includes(PERMISSIONS.UPDATE_SELF);

    if (canEditUsers) return next();

    if (canUpdateSelf && currentUser.contactId === targetContactId) {
      return next();
    }
    return res.sendStatus(403);
  },
};
