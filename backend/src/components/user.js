'use strict';
const {getSessionUser, getUserProfile} = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('../components/logger');
const _ = require ('lodash');
const { info } = require('../components/logger');
const e = require('express');


async function getUserInfo(req, res) {
  const userInfo = getSessionUser(req);
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data'
    });
  }

  
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

  log.info(facilityArr[0].statusCode);
  //log.info(facilityArr[0].organizationName);
  //log.info(facilityArr[0].organizationId);


  let orgName;
  let orgID;
  let appStatusCode = 'NOT STARTED';

  if (facilityArr[0] === undefined){
    orgName = 'NO ORG FOUND';
    orgID = 'NO ORG FOUND';
  }
  else {
    orgName = facilityArr[0].organizationName;
    orgID = facilityArr[0].organizationId;
  }
  
  facilityArr[0].statusCode = 100000001;

  switch(facilityArr[0].statusCode) {

  case 100000001:
    appStatusCode = 'APPROVED';
    break;

  case 100000002:
    //TO DO: complete when status codes are known, here and below are just assumptions to the actual codes
    appStatusCode = 'DRAFT';
    break;

  case 100000003:
    //TO DO: complete when status codes are known, here and below are just assumptions to the actual codes
    appStatusCode = 'SUBMITTED';
    break;

  default:
    appStatusCode = 'NOT STARTED';

  }

  //unread messages should be replaced later at some point
  let resData = {
    displayName: displayName,
    businessGuid: businessGuid,
    userName: userName,
    organizationName: orgName,
    organizationId:  orgID,
    applicationStatus: appStatusCode,
    unreadMessages: true,
    facilityList: facilityArr,
    
  };
  return res.status(HttpStatus.OK).json(resData);
}


//mapping of front end values to ugly backend values goes here 

//i think BCeID.ccof_userid is the right GUID to use? But i'm not 100 percent sure -- follow up on this 

//application status is not yet implemented in the Dynamics -- so that will change 
//


const GetUserProfileKeyMap = {
  'Organization.name':   'organizationName',
  'BCeID.ccof_userid': 'organizationId',
  'Application.statuscode' : 'statusCode',
  'CCOF.ccof_facility' : 'facilityId',
  'CCFRI.statuscode' : 'ccfriStatus',
  'ECEWE.statuscode' : 'eceweStatus',
};


//JB - this was the old endpoint I created while testing. Just left here for now in case we need to add another one. 
// async function getProfile(req, res) {
//   try {
//     

//     // //return res.status(HttpStatus.OK).json(x);
//     // return res.status(HttpStatus.OK).json(getFacilityArray(bGuid));
    
//   }
    
//   catch (e) {
//     log.info('broke in user component');
//     log.info(e);
//     return res.status(555).json(e.data? e.data : e?.status );
//   }
// }


async function getFacilityArray(businessGuid) {
  try {
    

    let bGuid = 'bb1defdf-7f9a-429f-be84-7668bd9e00ad'; //TODO: remove this and use the session GUID
    //}

    let currentUserProfile = await getUserProfile(bGuid);

    log.info (currentUserProfile);

    let x = currentUserProfile.map(item => {
      return  _(item).pick(Object.keys(GetUserProfileKeyMap)).mapKeys((value,key) => GetUserProfileKeyMap[key]).value();
    });


    //TODO: remove the line below. API is just returning improper (repeating) data with duplicate keys, giving me a ton of errors
    //in the front end.
    // x = x.slice(0,2);
    return(x);
    
  }
  catch (e) {
    log.info('broke in user component arr builder');
    log.info(e);
  }
}


module.exports = {
  getUserInfo,
  // getProfile
};
