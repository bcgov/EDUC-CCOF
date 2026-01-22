'use strict';
const Redis = require('./redis-client');
const config = require('../../config/index');

const log = require('../../components/logger');
const GUID_E = 'ESTIMATOR_CCOF_GUID_HASH_E';
const GUID_D = 'ESTIMATOR_CCOF_GUID_HASH_D';
const FACILITY_D = 'ESTIMATOR_FACILITY_D';
const { v4: uuidv4 } = require('uuid');

const cacheHelper = {
  async getGuidE(guid) {
    if (Redis.isReady) {
      const retVal = await Redis.client.hGet(GUID_E, guid);
      if (retVal) {
        return retVal;
      } else {
        const id = uuidv4();
        await Redis.client.hSet(GUID_E, guid, id);
        await Redis.client.hSet(GUID_D, id, guid);
        log.verbose(`GUIDE not found,setting for ${guid} returning ${id}`);
        return id;
      }
    } else {
      log.error('Redis client is not available, this should not have happened');
    }
  },
  async getGuidD(guid) {
    if (Redis.isReady) {
      const retVal = await Redis.client.hGet(GUID_D, guid);
      return retVal;
    } else {
      log.error('Redis client is not available, this should not have happened');
    }
  },
  async getFacility(guidd) {
    if (Redis.isReady) {
      const facilityTTL = Number(config.get('redis:estimatorFacilityTTL')) || 0;
      log.verbose('facility TTL: ', facilityTTL);
      if (facilityTTL > 0) {
        await Redis.client.expire(FACILITY_D, facilityTTL, 'NX');
      }

      const retVal = await Redis.client.hGet(FACILITY_D, guidd);
      if (retVal) {
        log.verbose(`found facilityd for guidd[${guidd}], with data: ${retVal}`);
        return JSON.parse(retVal);
      }
      log.verbose(`facilityd NOT found for guidd[${guidd}]`);
      return null;
    } else {
      log.error('Redis client is not available, this should not have happened');
    }
  },
  async setFacility(guidd, facility) {
    if (Redis.isReady) {
      await Redis.client.hSet(FACILITY_D, guidd, JSON.stringify(facility));
    } else {
      log.error('Redis client is not available, this should not have happened');
    }
  },
};

module.exports = cacheHelper;
