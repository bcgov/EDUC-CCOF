'use strict';
const {getSessionUser, getUserProfile} = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('../components/logger');
const _ = require ('lodash');
const { info } = require('../components/logger');


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

  //TODO: ApplicatioStatus and unreadMessages are hardcoded. Remove this with API values when built out!
  const  facilityArr = await getFacilityArray(businessGuid);

  log.info(facilityArr);
  //log.info(facilityArr[0].organizationName);
  //log.info(facilityArr[0].organizationId);

  let orgName = facilityArr[0].organizationName;
  if (!orgName){
    orgName = 'NO ORG FOUND';
  }

  let orgID = facilityArr[0].organizationId;
  if (!orgID){
    orgID = 'NO ORG FOUND';
  }


  let resData = {
    displayName: displayName,
    businessGuid: businessGuid,
    userName: userName,
    organizationName: orgName,
    organizationId:  orgID,
    applicationStatus: 'APPROVED',
    unreadMessages: true,
    facilityList: facilityArr,
    
  };
  return res.status(HttpStatus.OK).json(resData);
}


//mapping of front end values to ugly backend values goes here 

//i think BCeID.ccof_userid is the right GUID to use? But i'm not 100 percent sure -- follow up on this 

//application status is not yet implemented in the Dynamics -- so that will change 
//
// const GetUserProfileKeyMap = {
//   'Organization.name':   'organizationName',
//   'Organization.accountid': 'organizationId',
//   'Facility.name' : 'facilityName',
//   'Facility.accountid'  : 'facilityId',
//'CCOF.Facility.name' : 'facilityName'
// };

const GetUserProfileKeyMap = {
  'Organization.name':   'organizationName',
  'BCeID.ccof_userid': 'organizationId',
  'Application.statuscode' : 'statusCode',
  'CCOF.ccof_facility' : 'facilityId',
  'CCFRI.statuscode' : 'ccfriStatus',
  'ECEWE.statuscode' : 'eceweStatus',
};

async function getProfile(req, res) {
  try {
    //let userInfo = await getUserInfo(req, res);
    
    // let businessGuid = req.session?.passport?.user?._json?.bceid_business_guid;
    // if (!businessGuid) {
    //businessGuid = 'IDIR_' + req.session?.passport?.user?._json?.idir_user_guid; commenting out for now because my idir doesnt have bceid
    // let bGuid = 'a1e5c3f9-299d-4979-92c9-fea3520f428c'; //TODO: remove this and use the session GUID
    // //}

    // let currentUserProfile = await getUserProfile(bGuid);

    // //log.info (currentUserProfile);

    // currentUserProfile = currentUserProfile.value;

    // let x = currentUserProfile.map(item => {
    //   return  _(item).pick(Object.keys(GetUserProfileKeyMap)).mapKeys((value,key) => GetUserProfileKeyMap[key]);
    // });
    

    // //return res.status(HttpStatus.OK).json(x);
    // return res.status(HttpStatus.OK).json(getFacilityArray(bGuid));
    
  }
    
  catch (e) {
    log.info('broke in user component');
    log.info(e);
    return res.status(555).json(e.data? e.data : e?.status );
  }
}


async function getFacilityArray(businessGuid) {
  try {
    

    let bGuid = 'bb1defdf-7f9a-429f-be84-7668bd9e00ad'; //TODO: remove this and use the session GUID
    //}

    let currentUserProfile = await getUserProfile(bGuid);

    log.info (currentUserProfile);

    //currentUserProfile = currentUserProfile.value;
    // const organizationData = {
    //   'name' : currentUserProfile.Organization.name , 
    //   'orgId':  currentUserProfile.Organization.accountid,
    //   'applicationStatus' : 'APPROVED'
    // };

    //log.info(organizationData);

    //let x= currentUserProfile;

    let x = currentUserProfile.map(item => {
      return  _(item).pick(Object.keys(GetUserProfileKeyMap)).mapKeys((value,key) => GetUserProfileKeyMap[key]).value();
    });
    
    
    return(x);
    
  }
  catch (e) {
    log.info('broke in user component arr builder');
    log.info(e);
  }
}


module.exports = {
  getUserInfo,
  getProfile
};
