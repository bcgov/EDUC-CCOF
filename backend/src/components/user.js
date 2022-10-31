'use strict';
const {getSessionUser, getUserProfile} = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('../components/logger');
const _ = require ('lodash');


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


//mapping of front end values to ugly backend values goes here 

//i think BCeID.ccof_userid is the right GUID to use? But i'm not 100 percent sure -- follow up on this 

//application status is not yet implemented in the Dynamics -- so that will change 
const GetUserProfileKeyMap = {
  //organizationList: [
  'Organization.name':   'orgName',
  'Organization.accountid': 'orgId',

//]
};

async function getProfile(req, res) {
  try {
    //let userInfo = await getUserInfo(req, res);
    
    // let businessGuid = req.session?.passport?.user?._json?.bceid_business_guid;
    // if (!businessGuid) {
    //businessGuid = 'IDIR_' + req.session?.passport?.user?._json?.idir_user_guid; commenting out for now because my idir doesnt have bceid
    let bGuid = 'a1e5c3f9-299d-4979-92c9-fea3520f428c'; //TODO: remove this and use the session GUID
    //}

    let currentUserProfile = await getUserProfile(bGuid);

    log.info (currentUserProfile);

    log.info('below');
    currentUserProfile = currentUserProfile.value;
    log.info('boooz');

    let x = currentUserProfile.map(item => {
      return  _(item).pick(Object.keys(GetUserProfileKeyMap)).mapKeys((value,key) => GetUserProfileKeyMap[key]);
    });
    // currentUserProfile = currentUserProfile.map ((facility) => {
    //   currentUserProfile = _(facility).pick(Object.keys(GetUserProfileKeyMap)).mapKeys((value,key) => {return GetUserProfileKeyMap[key];});
    // });
    
    //currentUserProfile =  _(currentUserProfile).pick(Object.keys(GetUserProfileKeyMap)).mapKeys((value,key) => {return GetUserProfileKeyMap[key];});

    return res.status(HttpStatus.OK).json(x);
    
  }
    
  catch (e) {
    log.info('broke in user component');
    log.info(e);
    return res.status(555).json(e.data? e.data : e?.status );
  }
}


module.exports = {
  getUserInfo,
  getProfile
};
