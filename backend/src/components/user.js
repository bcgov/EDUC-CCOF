'use strict';
const config = require('../config/index');


function setupUserAndRedirect(req, res, accessToken, userInfo) {
  let resData = getUserInfo(userInfo);
  if (resData) {
    // res.session.CCOFUserInfo=resData;
    res.redirect(config.get('server:frontend') + '/landing-page');
  } else {
    res.redirect(config.get('server:frontend') + '/unauthorized');
  }
}

function getUserInfo(userInfo) {
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    return '';
  }

  let resData = {
    displayName: `${userInfo.displayName}`,
    facilityList: ['ABC daycare', '123 Daycare']
  };
  return resData;
}

module.exports = {
  getUserInfo,
  setupUserAndRedirect
};
