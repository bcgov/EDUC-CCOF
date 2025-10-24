module.exports = function (_role) {
  return async function (_req, _res, next) {
    // Not used for Pre-Renewals release
    return next();
  //   log.info(`validating role ${role}`);

  //   // Reject deactivated users
  //   if (req.session?.passport?.user?.statecode === 1) {
  //     log.info('User is deactivated, responding with 401');
  //     return res.status(HttpStatus.UNAUTHORIZED).json();
  //   }

  //   const userRole = req.session?.passport?.user?.role;
  //   if (!userRole) return res.sendStatus(403);
  //   !role || userRole.ofm_name === role ? next() : res.sendStatus(403);
  // };
};