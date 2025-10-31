/**
 * Validates that the user can perform a contact update.
 *
 * Editing self requires UPDATE_SELF permission.
 * Editing others requires EDIT_USERS permission.
 * @returns
 */
module.exports = function () {
  return async function (req, res, next) {
    // Not used for Pre-Renewals release
    return next();
    // log.verbose('Validating update contact for self or other');

    // const currentUser = req.session?.passport?.user;
    // const targetContactId = req.params.contactId;

    // const roles = await getRoles();
    // const matchingRole = roles.find((role) => role.data.roleNumber === currentUser.role.roleNumber);
    // const permissions = matchingRole?.data?.permissions?.map((p) => p.permissionNumber) || [];

    // if (currentUser.contactId === targetContactId) {
    //   // Validate update to self
    //   return permissions.includes(PERMISSIONS.UPDATE_SELF) ? next() : res.sendStatus(HttpStatus.FORBIDDEN);
    // } else {
    //   // Validate update to other user
    //   return permissions.includes(PERMISSIONS.EDIT_USERS) ? next() : res.sendStatus(HttpStatus.FORBIDDEN);
    // }
  };
};
