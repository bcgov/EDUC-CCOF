'use strict';

const onHeaders = require('on-headers');

/**
 * express-session only sends an absolute `Expires` attribute, which browsers evaluate against the client's clock.
 * Clients with a skewed clock (e.g. manually adjusted after a missed time zone change) can discard the cookie on
 * arrival. `Max-Age` is relative to receipt and takes precedence over `Expires` (RFC 6265), so append it.
 *
 * Must be registered BEFORE the session middleware: on-headers listeners run in reverse registration order,
 * so this runs after express-session has written its Set-Cookie header.
 */
function cookieMaxAge(cookieName, maxAgeMs) {
  const prefix = `${cookieName}=`;
  const maxAgeAttr = `; Max-Age=${Math.floor(maxAgeMs / 1000)}`;

  const addMaxAge = (cookie) => (cookie.startsWith(prefix) ? cookie + maxAgeAttr : cookie);

  return (_req, res, next) => {
    onHeaders(res, function () {
      const header = this.getHeader('Set-Cookie');
      if (!header) return;
      this.setHeader('Set-Cookie', [header].flat().map(String).map(addMaxAge));
    });
    next();
  };
}

module.exports = cookieMaxAge;
