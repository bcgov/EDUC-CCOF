'use strict';
const {getSessionUser, getHttpHeader, minify, getUserGuid, getUserName, getConstKey} = require('./utils');
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
    userName: getUserName(req),
    email: req.session.passport.user._json.email,
    organizationName: null,
    organizationId:  null,
    applicationId: null,
    applicationStatus: null,
    //TODO: unreadMessages is hardcoded. Remove this with API values when built out!
    unreadMessages: true, 
    facilityList: [],
  };


  let userGuid = getUserGuid(req);
  console.info('User Guid is: ', userGuid);
  const userResponse = await getUserProfile(userGuid);



  // If no data back, then no associated Organization/Facilities, return empty orgination data
  if (userResponse[0] === undefined){
    return res.status(HttpStatus.OK).json(resData);
  }

  //Organization is not normalized, grab organization info from the first element
  resData.organizationName  = userResponse[0]['Organization.name'];
  resData.organizationId  = userResponse[0]['_ccof_organization_value'];
  resData.applicationId =  userResponse[0]['Application.ccof_applicationid'];
  let statusCode = userResponse[0]['_ccof_organization_value'];
  if (statusCode) {
    statusCode = getConstKey(APPLICATION_STATUS_CODES,userResponse[0]['Application.statuscode']);
    if (!statusCode) {
      // TODO: should really throw an error, but for now until the
      // statuses are stable, just return whatever the value is.
      statusCode = `UNKNOWN - [${userResponse[0]['Application.statuscode']}]`;
    }
  } else {
    // No status code means new CCOF application
    statusCode = 'NEW';
  }
  resData.applicationStatus  = statusCode;

  let facilityArr = userResponse.map(item => {
    return  _(item).pick(Object.keys(GetUserProfileKeyMap)).mapKeys((value,key) => GetUserProfileKeyMap[key]).value();
  });
  facilityArr.map( item => {
    item.ccfriStatus = getConstKey(CCFRI_STATUS_CODES, item.ccfriStatus);
    item.eceweStatus = getConstKey(ECEWE_STATUS_CODES, item.eceweStatus);
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
  'CCFRI.ccof_ccfrioptin' : 'ccfriOptInStatus'
};


async function getUserProfile(businessGuid) {
  
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + `/api/UserProfile?userId=${businessGuid}`;
    log.info('UserProfile Url is', url);
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
