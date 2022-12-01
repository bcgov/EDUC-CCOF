'use strict';
const {getSessionUser, getHttpHeader, minify, getUserGuid, getUserName, getLabelFromValue, postOperation, isIdirUser} = require('./utils');
const config = require('../config/index');
const ApiError = require('./error');
const axios = require('axios');
const HttpStatus = require('http-status-codes');
const log = require('../components/logger');
const { APPLICATION_STATUS_CODES, CCFRI_STATUS_CODES, ECEWE_STATUS_CODES, CCOF_STATUS_CODES, OPTIN_STATUS_CODES, ORGANIZATION_PROVIDER_TYPES} = require('../util/constants');
const { UserProfileFacilityMappings, UserProfileOrganizationMappings } = require('../util/mapping/Mappings');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const _ = require ('lodash');



async function getUserInfo(req, res) {

  const userInfo = getSessionUser(req);
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data'
    });
  }
  let isIdir = isIdirUser(req);
  let userName = req.params?.userName;
  let resData = {
    displayName: (userName)? req.session.passport.user._json.display_name + '|' + userName : req.session.passport.user._json.display_name,
    userName: getUserName(req),
    email: req.session.passport.user._json.email,
    isMinistryUser: isIdir,
    organizationName: null,
    organizationId:  null,
    applicationId: null,
    applicationStatus: null,
    //TODO: unreadMessages is hardcoded. Remove this with API values when built out!
    unreadMessages: false, 
    facilityList: [],
  };
  if (isIdir && !userName) {
    //Return from here since ministry staff should not have an account
    return res.status(HttpStatus.OK).json(resData);
  }
  let userGuid = (isIdir && userName) ? req.params.userName : getUserGuid(req); //TODO: convert username to guid
  log.verbose('User Guid is: ', userGuid);
  if (!userGuid) {
    //userGuid will be null if ministry staff and initial login without userName
    return res.status(HttpStatus.OK).json(resData);
  }
  const userResponse = await getUserProfile(userGuid);

  if (log.isVerboseEnabled) {
    log.verbose('getUserProfile response:',minify(userResponse));
  }

  // If no data back, then no associated Organization/Facilities, return empty orgination data
  if (userResponse[0] === undefined){
    if (isIdir) {
      return res.status(HttpStatus.NOT_FOUND).json(resData);      
    } else {
      return res.status(HttpStatus.OK).json(resData);
    }
  }
  if (userResponse === 'abc') { //TODO: get the right way
    creatUser(req);
  }
  //Organization is not normalized, grab organization info from the first element
  let organization = new MappableObjectForFront(userResponse[0], UserProfileOrganizationMappings).data;
  
  organization.applicationStatus = getLabelFromValue(organization.applicationStatus, APPLICATION_STATUS_CODES, 'NEW');
  organization.organizationProviderType = getLabelFromValue(organization.organizationProviderType, ORGANIZATION_PROVIDER_TYPES);
  let facilityList = [];
  userResponse.forEach(item => {
    let facility = new MappableObjectForFront(item, UserProfileFacilityMappings).data;
    if (!_.isEmpty(facility)) {
      facility.ccofBaseFundingStatus = getLabelFromValue(facility.ccofBaseFundingStatus, CCOF_STATUS_CODES);
      facility.ccfriStatus = getLabelFromValue(facility.ccfriStatus, CCFRI_STATUS_CODES);
      facility.ccfriOptInStatus = getLabelFromValue(facility.ccfriOptInStatus, OPTIN_STATUS_CODES);
      facility.eceweStatus = getLabelFromValue(facility.eceweStatus, ECEWE_STATUS_CODES);
      facility.eceweOptInStatus = getLabelFromValue(facility.eceweOptInStatus, OPTIN_STATUS_CODES);
      facilityList.push(facility);
    }
  });
  resData.facilityList = facilityList;
  let results = {
    ...resData,
    ...organization
  };
  return res.status(HttpStatus.OK).json(results);
}

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

async function creatUser(req) {
  try {
    let payload = {
      ccof_userid: getUserGuid,
      firstname: req.session.passport.user._json.given_name,
      lastname: req.session.passport.user._json.family_name,
      emailaddress1: req.session.passport.user._json.email,
      ccof_username: getUserName(req)
    };
    postOperation('contacts', payload);
  } catch (e) {
    log.error('Error when creating user: ', e);
    throw e;
  }
}



module.exports = {
  getUserInfo,
};
