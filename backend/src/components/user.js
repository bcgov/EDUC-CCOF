'use strict';
const {getSessionUser} = require('./utils');
const HttpStatus = require('http-status-codes');

async function getUserInfo(req, res) {
  const userInfo = getSessionUser(req);
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data'
    });
  }
  let resData = {
    displayName: `${req.session.passport.user.displayName}`,
    organizationList: [{
      organizationName: 'ABC organization',
      organizationId: 'org123',
      facilityList: [{
        facilityName: 'ABC daycare',
        facilityId: 'fac123'},
      {
        facilityName: 'Happy Bugz daycare',
        facilityId: 'fac222',
      },],
    }],
  };
  return res.status(HttpStatus.OK).json(resData);
}

module.exports = {
  getUserInfo
};
