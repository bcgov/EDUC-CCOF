'use strict';
const {getSessionUser} = require('./utils');
const HttpStatus = require('http-status-codes');
// const log = require('../components/logger');


async function getUserInfo(req, res) {
  const userInfo = getSessionUser(req);
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data'
    });
  }

  /* 
  data used for dev build of LandingPage.vue 
  will be replaced with API data at a later time
     
  /* applicationStatus: NOT STARTED, DRAFT, SUBMITTED, APPROVED */
  let displayName = req.session.passport.user.displayName;
  if (!displayName) {
    displayName = req.session.passport.user._json.display_name;
  }
  let userName = req.session?.passport?.user?._json?.bceid_username;
  if (!userName) {
    userName = req.session?.passport?.user?._json?.idir_username;
  }
  let businessGuid = req.session?.passport?.user?._json?.bceid_business_guid;
  if (!businessGuid) {
    businessGuid = 'IDIR_' + req.session?.passport?.user?._json?.idir_user_guid;
  }
  let resData = {
    displayName: displayName,
    businessGuid: businessGuid,
    userName: userName,
    organizationList: [{
      organizationName: 'ABC organization',
      organizationId: 'org123',
      applicationStatus: 'APPROVED',
      unreadMessages: true,
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
