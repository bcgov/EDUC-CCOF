'use strict';
const {getSessionUser, getHttpHeader, minify, parseUserGuid, parseUserName} = require('./utils');
const config = require('../config/index');
const ApiError = require('./error');
const axios = require('axios');
const HttpStatus = require('http-status-codes');
const log = require('../components/logger');
const { APPLICATION_STATUS_CODES, CCFRI_STATUS_CODES, ECEWE_STATUS_CODES , FACILITY_AGE_GROUP_CODES} = require('../util/constants');
const _ = require ('lodash');

async function getUserInfo(req, res) {

  const userInfo = getSessionUser(req);
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data'
    });
  }

  let resData = {
    displayName: req.session.passport.user._json.display_name,
    userName: parseUserName(req),
    email: req.session.passport.user._json.email,
    organizationName: null,
    organizationId:  null,
    applicationStatus: null,
    //TODO: unreadMessages is hardcoded. Remove this with API values when built out!
    unreadMessages: true, 
    facilityList: [],
  };


  let businessGuid = parseUserGuid(req);
  console.info('Business GUID is: ', businessGuid);
  let userResponse = await getUserProfile(businessGuid);

  log.verbose('Status  :: is :: ', userResponse.status);
  log.verbose('StatusText   :: is :: ', userResponse.statusText);
  log.verbose('Response   :: is :: ', minify(userResponse.data));

  
  // If no data back, then no associated Organization/Facilities, return empty orgination data
  if (userResponse[0] === undefined){
    return res.status(HttpStatus.OK).json(resData);
  }

  //Organization is not normalized, grab organization info from the first element
  resData.organizationName  = userResponse[0]['Organization.name'];
  resData.organizationId  = userResponse[0]['_ccof_organization_value'];
  let parsedStatus =APPLICATION_STATUS_CODES[userResponse[0]['Application.statuscode']];
  if (!parsedStatus) {
    parsedStatus = `UNKNOWN - [${userResponse[0]['Application.statuscode']}]`;
  }
  resData.applicationStatus  = parsedStatus;

  let facilityArr = userResponse.map(item => {
    return  _(item).pick(Object.keys(GetUserProfileKeyMap)).mapKeys((value,key) => GetUserProfileKeyMap[key]).value();
  });
  facilityArr.map( item => {
    item.ccfriStatus = CCFRI_STATUS_CODES[item.ccfriStatus];
    item.eceweStatus = ECEWE_STATUS_CODES[item.eceweStatus];
    item.facilityAgeGroups = ['1', '2' , '3'];
    item.facilityAgeGroupNames = ['0 to 18 months','18 to 36 months','3 Years to Kindergarten'];
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
