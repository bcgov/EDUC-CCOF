/**
 * Validates that the user is authorized to work with the specified Facility.
 * @param
 * @returns
 */
module.exports = function () {
  return async function (_req, _res, next) {
    // Not used for Pre-Renewals release
    return next();
    // log.verbose('validating facility');
    // // TODO (weskubo-cgi) Determine if this is required once Impersonate is confirmed
    // //if (isIdirUser(req)) return next();

    // const facilityId = req.params.facilityId ?? req.query.facilityId ?? req.body.facilityId;
    // if (!facilityId) {
    //   return next();
    // }

    // // Validation is only for Facility Admin
    // // Other roles are not restricted by facility and have their permissions validated in validatePermission
    // if (!isFacilityAdmin(req.session?.passport?.user)) {
    //   return next();
    // }

    // const valid = req.session?.passport?.user?.facilities?.some((facility) => facility.facilityId === facilityId);

    // valid ? next() : res.sendStatus(403);
  };
};
