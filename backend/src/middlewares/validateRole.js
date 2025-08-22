const log = require('../components/logger');

module.exports = function (role) {
  return async function (req, res, next) {
    log.info(`validating role ${role}`);
    const userRole = req.session?.passport?.user?.role;
    if (!userRole) return res.sendStatus(403);
    !role || userRole.ofm_name === role ? next() : res.sendStatus(403);
  };
};
