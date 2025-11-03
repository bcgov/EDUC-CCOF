const log = require('../components/logger');

/**
 * Disables the endpoint.
 * @param
 * @returns
 */
module.exports = function () {
  return async function (_req, res, _next) {
    log.warning('This endpoint has been disabled, responding with 404');
    return res.sendStatus(404);
  };
};
