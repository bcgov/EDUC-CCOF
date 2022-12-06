'use strict';
const {getSessionUser, getHttpHeader, minify, getUserGuid, getUserName, getLabelFromValue} = require('./utils');
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

  let resData = {
    displayName: req.session.passport.user._json.display_name,
    userName: getUserName(req),
    email: req.session.passport.user._json.email,
    organizationName: null,
    organizationId:  null,
    applicationId: null,
    applicationStatus: null,
    //TODO: unreadMessages is hardcoded. Remove this with API values when built out!
    unreadMessages: false, 
    facilityList: [],
  };

  let userGuid = getUserGuid(req);
  log.verbose('User Guid is: ', userGuid);
 
  const userResponse = await getUserProfile(userGuid);

  if (log.isVerboseEnabled) {
    log.verbose('getUserProfile response:',minify(userResponse));
  }

  // If no data back, then no associated Organization/Facilities, return empty orgination data
  if (userResponse === undefined){
    return res.status(HttpStatus.OK).json(resData);
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
    log.info('UserProfile Url is', url);
    const response = await axios.get(url, getHttpHeader());
    return response.data;
  } catch (e) {
    log.error('getUserProfile Error', e.response ? e.response.status : e.message);
    //throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, {message: 'API Get error'}, e);
  }
}

module.exports = {
  getUserInfo,
};
