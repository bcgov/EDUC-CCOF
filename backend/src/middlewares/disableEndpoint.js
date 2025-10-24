/**
 * Disables the endpoint.
 * @param
 * @returns
 */
module.exports = function () {
  return async function (_req, res, _next) {
    return res.sendStatus(404);
  };
};
