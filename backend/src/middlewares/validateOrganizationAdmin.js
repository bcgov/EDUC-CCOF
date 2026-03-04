const HttpStatus = require('http-status-codes');
const { isIdirUser } = require('../components/utils');

/**
 * Validates that the admin user editing an organization belongs to that
 * organization.
 */
module.exports = async function validateOrganizationAdmin(req, res, next) {
  if (isIdirUser(req)) {
    return next();
  }

  const organizationId = req.params.organizationId ?? req.query.organizationId ?? req.body.organizationId;
  const userOrganizationId = req.session?.passport?.user?.organizationId;

  if (!organizationId || !userOrganizationId || organizationId !== userOrganizationId) {
    return res.sendStatus(HttpStatus.UNAUTHORIZED);
  }

  next();
};
