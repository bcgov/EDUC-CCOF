'use strict';

const axios = require('axios');
const config = require('../config/index');
const log = require('./logger');
const HttpStatus = require('http-status-codes');
const lodash = require('lodash');
const { ApiError } = require('./error');
const jsonwebtoken = require('jsonwebtoken');
const { LocalDateTime, DateTimeFormatter } = require('@js-joda/core');
const { Locale } = require('@js-joda/locale_en');
const { MappableObjectForFront, MappableObjectForBack, getMappingString } = require('../util/mapping/MappableObject');
let discovery = null;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildFilterQuery(query, mapping) {
  if (lodash.isEmpty(query)) return;
  let filterQuery = '';
  const mappedQuery = new MappableObjectForBack(query, mapping).toJSON();
  Object.entries(mappedQuery)?.forEach(([key, value]) => {
    filterQuery = lodash.isEmpty(filterQuery) ? filterQuery.concat(`$filter=${key} eq ${value}`) : filterQuery.concat(` and ${key} eq ${value}`);
  });
  return filterQuery;
}

function getConstKey(constants, value) {
  if (value) {
    for (let key in constants) {
      if (constants[key] === value) {
        return key;
      }
    }
    log.error(`getConstKey: Unable to find key for value: [${value}] for const: [${constants?.constructor?.name}]`);
  }
  return undefined;
}

function getLabelFromValue(value, constants, defaultValue) {
  if (!value && defaultValue) {
    return defaultValue;
  }
  if (value) {
    let retVal = getConstKey(constants, value);
    if (retVal) {
      return retVal;
    } else {
      return `UNKNOWN - [${value}]`;
    }
  }
  return value;
}

/**
 * Pads the given input value on the left with the specified character
 * until it reaches the desired length.
 *
 * @param input - The value to pad (can be a number, string, etc.).
 * @param length - The total desired length of the resulting string.
 * @param char - The character to use for padding.
 * @returns A padded string, or null if input is null or undefined.
 */
function padString(input, length, char) {
  if (input == null) return null;
  return String(input).padStart(length, char);
}

axios.interceptors.request.use((axiosRequestConfig) => {
  axiosRequestConfig.headers['X-Client-Name'] = 'EDUC-CCOF';
  return axiosRequestConfig;
});
// Returns OIDC Discovery values
async function getOidcDiscovery() {
  if (!discovery) {
    try {
      const response = await axios.get(config.get('oidc:discovery'));
      discovery = response.data;
    } catch (error) {
      log.error('getOidcDiscovery', `OIDC Discovery failed - ${error.message}`);
    }
  }
  return discovery;
}

function minify(obj, keys = ['documentData']) {
  return lodash.transform(obj, (result, value, key) => (result[key] = keys.includes(key) && lodash.isString(value) ? value.substring(0, 1) + ' ...' : value));
}

function getSessionUser(req) {
  log.verbose('getSessionUser', req.session);
  const session = req.session;
  return session && session.passport && session.passport.user;
}

function getUserGuid(req) {
  const userInfo = req.session?.passport?.user;
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, { message: 'API Get error' });
  }

  return userInfo._json.guid;
}

function isIdirUser(req) {
  const userInfo = req.session?.passport?.user;
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, { message: 'API Get error' });
  }
  const isIdir = !!req.session?.passport?.user?._json?.idir_username;

  // For local development only.
  // generally set isIdirUser to false, so that developers can log in using their
  // IDIRS as a normal, non-ministry user.
  if ('local' === config.get('environment') && !config.get('server:useImpersonate')) {
    return false;
  }
  return isIdir;
}
function getUserName(req) {
  let userName = req.session?.passport?.user?._json?.bceid_username;
  if (!userName) {
    userName = req.session?.passport?.user?._json?.idir_username;
  }
  return userName;
}
function getAccessToken(req) {
  const user = getSessionUser(req);
  return user && user.jwt;
}

function logResponse(methodName, response) {
  if (log.isVerboseEnabled) {
    log.verbose(`Status for ${methodName} :: is :: `, response.status);
    log.verbose(`StatusText for ${methodName}  :: is :: `, response.statusText);
    log.verbose(`Response for ${methodName}  :: is :: `, minify(response.data));
  }
}

async function deleteOperationWithObjectId(operation, objectId) {
  const operationWithObject = `${operation}(${objectId})`;
  //log.info('del OPERATION:' , operationWithObject);
  return await deleteOperation(operationWithObject);
}

async function deleteOperation(operation) {
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + '/api/Operations?statement=' + operation;
    log.info('delete Data Url', url);
    const response = await axios.delete(url, getHttpHeader());
    return response.data;
  } catch (e) {
    log.error('deleteOperation Error', e.response ? e.response.status : e.message);
    log.info(e);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Get error' }, e);
  }
}

async function getOperation(operation) {
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + '/api/Operations?statement=' + operation;
    log.info('get Data Url', url);
    const response = await axios.get(url, getHttpHeader());
    //logResponse('getOperation', response);
    return response.data;
  } catch (e) {
    log.info(e);
    log.error('getOperation Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Get error' }, e);
  }
}

async function getOperationWithObjectId(operation, objectId) {
  const operationWithObject = `${operation}(${objectId})`;
  return await getOperation(operationWithObject);
}

async function postOperation(operation, payload) {
  const url = config.get('dynamicsApi:apiEndpoint') + '/api/Operations?statement=' + operation;
  log.info('postOperation Url', url);

  if (log.isInfoEnabled) {
    log.verbose(`postOperation post data for ${url}  :: is :: `, minify(payload));
  }
  try {
    const response = await axios.post(url, payload, getHttpHeader());
    if (log.isVerboseEnabled) {
      log.verbose('Status for postOperation :: is :: ', response.status);
      log.verbose('StatusText for postOperation  :: is :: ', response.statusText);
      log.verbose('Response for postOperation  :: is :: ', response.data);
    }
    return response.data;
  } catch (e) {
    log.error('postOperation Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Post error' }, e);
  }
}

async function postApplicationDocument(payload) {
  const url = config.get('dynamicsApi:apiEndpoint') + '/api/ApplicationDocument';
  log.info('postApplicationDocument Url', url);
  if (log.isDebugEnabled()) {
    log.debug(`postApplicationDocument post data for ${url}  :: is :: `, minify(payload, ['documentbody']));
  }
  try {
    const response = await axios.post(url, payload, getHttpHeader());
    logResponse('postApplicationDocument', response);
    return response.data;
  } catch (e) {
    log.error('postOperation Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Post error' }, e);
  }
}
async function getApplicationDocument(applicationID) {
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + '/api/ApplicationDocument?applicationId=' + applicationID;
    log.info('get Data Url', url);
    const response = await axios.get(url, getHttpHeader());
    return response.data;
  } catch (e) {
    log.error(' getApplicationDocument Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Get error' }, e);
  }
}

async function getSubmissionPDFHistory(organizationId) {
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + '/api/SubmissionPDFHistory?OrgId=' + organizationId;
    log.info('get Data Url', url);
    const response = await axios.get(url, getHttpHeader());
    return response.data;
  } catch (e) {
    log.error(' getSubmissionPDFHistory Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Get error' }, e);
  }
}

async function getDocument(annotationId) {
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + '/api/Document?annotationId=' + annotationId;
    log.info('get Data Url', url);
    const response = await axios.get(url, getHttpHeader());
    return response.data;
  } catch (e) {
    log.error(' getApplicationDocument Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Get error' }, e);
  }
}
async function deleteDocument(annotationid) {
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + '/api/Document?annotationid=' + annotationid;
    log.info('delete Data Url', url);
    const response = await axios.delete(url, getHttpHeader());
    return response.data;
  } catch (e) {
    log.error(' deleteDocument Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Get error' }, e);
  }
}

async function patchOperationWithObjectId(operation, objectId, payload) {
  const operationWithObject = `${operation}(${objectId})`;
  const url = config.get('dynamicsApi:apiEndpoint') + '/api/Operations?statement=' + operationWithObject;
  log.info('patchOperationWithObjectId Url', url);

  if (log.isInfoEnabled) {
    log.verbose(`patchOperationWithObjectId post data for ${url}  :: is :: `, minify(payload));
  }
  try {
    const response = await axios.patch(url, payload, getHttpHeader());
    logResponse('patchOperationWithObjectId', response);
    return response.data;
  } catch (e) {
    log.error(e);
    log.error('patchOperationWithObjectId Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Patch error' }, e);
  }
}

async function getChangeActionDocument(changeActionId) {
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + '/api/ChangeActionDocument?changeactionId=' + changeActionId;
    log.info('get Data Url', url);
    const response = await axios.get(url, getHttpHeader());
    return response.data;
  } catch (e) {
    log.error(' get Change Action Document Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Get error' }, e);
  }
}

async function postChangeActionDocument(payload) {
  const url = config.get('dynamicsApi:apiEndpoint') + '/api/ChangeActionDocument';
  log.info('postChangeActionDocument Url', url);
  if (log.isVerboseEnabled()) {
    log.verbose(`postChangeActionDocument post data for ${url}  :: is :: `, minify(payload, ['documentbody']));
  }
  try {
    const response = await axios.post(url, payload, getHttpHeader());
    logResponse('postChangeActionDocument', response);
    return response.data;
  } catch (e) {
    log.error('postOperation Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Post error' }, e);
  }
}

async function updateChangeRequestNewFacility(changeRequestNewFacilityId, payload) {
  try {
    let response = await patchOperationWithObjectId('ccof_change_request_new_facilities', changeRequestNewFacilityId, payload);
    return response;
  } catch (e) {
    log.error('error', e);
    return e.data ? e.data : e?.status;
  }
}

// get Change Action details.  depending on the entity, we may want to get details 2 level below change action
async function getChangeActionDetails(changeActionId, changeDetailEntity, changeDetailMapper, joiningTable, joiningTableMapping) {
  if (changeActionId && changeDetailEntity && changeDetailMapper) {
    try {
      let operation;
      if (joiningTable) {
        operation = `${changeDetailEntity}?$select=${getMappingString(changeDetailMapper)}&$filter=_ccof_change_action_value eq '${changeActionId}'&$expand=${joiningTable}($select=${getMappingString(
          joiningTableMapping,
        )})`;
      } else {
        operation = `${changeDetailEntity}?$select=${getMappingString(changeDetailMapper)}&$filter=_ccof_change_action_value eq '${changeActionId}'`;
      }

      let changeActionDetails = await getOperation(operation);
      let details = changeActionDetails?.value;
      let retVal = [];
      details?.forEach((el) => {
        let data = new MappableObjectForFront(el, changeDetailMapper).toJSON();
        let joinData;
        if (joiningTable) {
          joinData = new MappableObjectForFront(el[joiningTable], joiningTableMapping).toJSON();
        }
        retVal.push({ ...data, ...joinData });
      });
      return retVal;
    } catch (e) {
      log.error('Unable to get change action details', e);
    }
  } else {
    return undefined;
  }
}

async function postAdjustmentERGeneration(payload) {
  const url = config.get('dynamicsApi:apiEndpoint') + '/api/AdjustmentERGeneration';
  if (log.isVerboseEnabled()) {
    log.verbose(`postAdjustmentERGeneration post data for ${url}  :: is :: `, payload);
  }
  try {
    const response = await axios.post(url, payload, getHttpHeader());
    logResponse('postAdjustmentERGeneration', response);
    return response;
  } catch (e) {
    log.error('postAdjustmentERGeneration Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Post error' }, e);
  }
}

function getHttpHeader() {
  return {
    headers: {
      // D365 Controllers are currently inconsistent with their returned Content-Type (application/json and text/plain)
      // so use a wildcard to avoid integration errors
      Accept: '*/*',
      'Content-Type': 'application/json',
      [config.get('dynamicsApi:apiKeyHeader')]: config.get('dynamicsApi:apiKeyValue'),
    },
  };
}

function generateJWTToken(jwtid, subject, issuer, algorithm, payload) {
  const tokenTTL = config.get('email:tokenTTL'); // this should be in minutes
  const jwtSecretKey = config.get('email:secretKey');
  let sign_options_schema = {
    expiresIn: tokenTTL * 60,
    algorithm: algorithm,
    issuer: issuer,
    jwtid: jwtid,
    subject: subject,
  };

  return jsonwebtoken.sign(payload, jwtSecretKey, sign_options_schema);
}

function formatCommentTimestamp(time) {
  const timestamp = LocalDateTime.parse(time);
  return timestamp.format(DateTimeFormatter.ofPattern('yyyy-MM-dd h:mma').withLocale(Locale.CANADA));
}

function errorResponse(res, msg, code) {
  return res.status(code || HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: msg || 'INTERNAL SERVER ERROR',
    code: code || HttpStatus.INTERNAL_SERVER_ERROR,
  });
}

const utils = {
  getOidcDiscovery,
  prettyStringify: (obj, indent = 2) => JSON.stringify(obj, null, indent),
  buildFilterQuery,
  getSessionUser,
  getAccessToken,
  getUserGuid,
  isIdirUser,
  getUserName,
  getOperationWithObjectId,
  getOperation,
  postOperation,
  patchOperationWithObjectId,
  generateJWTToken,
  formatCommentTimestamp,
  errorResponse,
  minify,
  getHttpHeader,
  getConstKey,
  getLabelFromValue,
  deleteOperationWithObjectId,
  deleteOperation,
  postApplicationDocument,
  getApplicationDocument,
  deleteDocument,
  getDocument,
  sleep,
  getChangeActionDocument,
  postChangeActionDocument,
  updateChangeRequestNewFacility,
  getSubmissionPDFHistory,
  getChangeActionDetails,
  postAdjustmentERGeneration,
  padString,
};

module.exports = utils;
