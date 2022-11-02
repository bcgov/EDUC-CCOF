'use strict';
const {getSessionUser, getHttpHeader} = require('./utils');
const config = require('../config/index');
const ApiError = require('./error');
const axios = require('axios');
const HttpStatus = require('http-status-codes');
const log = require('../components/logger');
const { APPLICATION_STATUS_CODES, CCFRI_STATUS_CODES, ECEWE_STATUS_CODES } = require('../util/constants');
const _ = require ('lodash');

async function getUserInfo(req, res) {

  let resData = {
    displayName: null,
    businessGuid: null,
    userName: null,
    organizationName: null,
    organizationId:  null,
    applicationStatus: null,
    //TODO: ApplicatioStatus and unreadMessages are hardcoded. Remove this with API values when built out!
    unreadMessages: true, 
    facilityList: [],
  };


  const userInfo = getSessionUser(req);
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data'
    });
  }

  //TODO: Rob to clean this up.
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
    businessGuid = req.session?.passport?.user?._json?.idir_user_guid;
  }

  resData.displayName = displayName;
  resData.businessGuid = businessGuid;
  resData.userName = userName;

  //TODO: change this before git commiting!
  //const userResponse = await getUserProfile(businessGuid);

  const userResponse = [
    {
      'Organization.name' : "Test Org 1",
      'BCeID.ccof_userid' : "123-bbbb-cccc",
      'Application.statuscode' : 100000001 ,
      'CCOF.ccof_facility' : '123456',
      'CCOF.Facility.name' : 'Best Daycare 1',
      'CCFRI.statuscode' : 1,
      'ECEWE.statuscode' : 1,

    },
    {
      'Organization.name' : "Test Org 1",
      'BCeID.ccof_userid' : "123-bbbb-cccc",
      'Application.statuscode' : 100000001 ,
      'CCOF.ccof_facility' : '987352723',
      'CCOF.Facility.name' : 'Wee lil happy babiez',
      'CCFRI.statuscode' : 2,
      'ECEWE.statuscode' : 1,
    }
  ];


  // If no data back, then no associated Organization/Facilities, return empty orgination data
  if (userResponse[0] === undefined){
    return res.status(HttpStatus.OK).json(resData);
  }

  //Organization is not normalized, grab organization info from the first element
  resData.organizationName  = userResponse[0]['Organization.name'];
  resData.organizationId  = userResponse[0]['BCeID.ccof_userid'];
  resData.applicationStatus  = APPLICATION_STATUS_CODES[userResponse[0]['Application.statuscode']];

  let facilityArr = userResponse.map(item => {
    return  _(item).pick(Object.keys(GetUserProfileKeyMap)).mapKeys((value,key) => GetUserProfileKeyMap[key]).value();
  });
  facilityArr.map( item => {
    item.ccfriStatus = CCFRI_STATUS_CODES[item.ccfriStatus];
    item.eceweStatus = ECEWE_STATUS_CODES[item.eceweStatus];
    return item;
  });
  resData.facilityList = facilityArr;
  
  return res.status(HttpStatus.OK).json(resData);
}

const GetUserProfileKeyMap = {
  'CCOF.ccof_facility' : 'facilityId',
  'CCOF.Facility.name' : 'facilityName',
  'CCFRI.statuscode' : 'ccfriStatus',
  'ECEWE.statuscode' : 'eceweStatus',
};


async function getUserProfile(businessGuid) {
  
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + `/api/UserProfile?userId=${businessGuid}`;
    log.verbose('UserProfile Url is', url);
    const response = await axios.get(url, getHttpHeader());
    return response.data;
  } catch (e) {
    log.error('getUserProfile Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, {message: 'API Get error'}, e);
  }
}

module.exports = {
  getUserInfo,
};
