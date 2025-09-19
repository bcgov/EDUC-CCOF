const log = require('../components/logger');
const { PERMISSIONS } = require('../util/constants');
const { getRoles } = require('../components/lookup');

/**
 * Validates that the user can edit other or themselves.
 *
 */
module.exports = function () {
  return async function (req, res, next) {
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
  };
};
