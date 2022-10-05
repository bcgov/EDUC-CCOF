'use strict';
const {getSessionUser} = require('./utils');
const HttpStatus = require('http-status-codes');

async function getUserInfo(req, res) {
  const userInfo = getSessionUser(req);
  if (!userInfo || !userInfo.jwt || !userInfo._json || !userInfo._json.digitalIdentityID) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data'
    });
  }
  let resData = {
    displayName: `${req.session.edxUserData?.firstName} ${req.session.edxUserData?.lastName}`,
    facilityList: ['ABC daycare', '123 Daycare']
  };
  return res.status(HttpStatus.OK).json(resData);

}

module.exports = {
  getUserInfo
};
