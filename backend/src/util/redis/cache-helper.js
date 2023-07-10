'use strict';
const Redis = require('./redis-client');
const config = require('../../config/index');

const log = require('../../components/logger');
const GUID_E = 'CCOF_GUID_HASH_E';
const GUID_D = 'CCOF_GUID_HASH_D';
const FACILITY_D = 'FACILITY_D';
const { v4: uuidv4 } = require('uuid');

const cacheHelper = {
  async getGuidE(guid) {
    const redisClient = Redis.getRedisClient();
    if (redisClient) {
      const retVal = await redisClient.hget(GUID_E, guid);
      if (retVal) {
        return retVal;
      } else {
        const id = uuidv4();
        await redisClient.hset(GUID_E, guid, id);
        await redisClient.hset(GUID_D, id, guid);
        log.verbose(`GUIDE not found,setting for ${guid} returning ${id}`);
        return id;
      }
    } else {
      log.error('Redis client is not available, this should not have happened');
    }
  },
  async getGuidD(guid) {
    const redisClient = Redis.getRedisClient();
    if (redisClient) {
      const retVal = await redisClient.hget(GUID_D, guid);
      return retVal;
    } else {
      log.error('Redis client is not available, this should not have happened');
    }
  },
  async getFacility(guidd) {
    const redisClient = Redis.getRedisClient();
    if (redisClient) {
      const facilityTTL = Number(config.get('redis:facilityTTL'));
      log.verbose('facility TTL: ', facilityTTL);
      if (facilityTTL > 0) {
        await redisClient.expire(FACILITY_D, facilityTTL, 'NX');
      }

      const retVal = await redisClient.hget(FACILITY_D, guidd);
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
    const redisClient = Redis.getRedisClient();
    if (redisClient) {
      await redisClient.hset(FACILITY_D, guidd, JSON.stringify(facility));
    } else {
      log.error('Redis client is not available, this should not have happened');
    }
  },
};

module.exports = cacheHelper;
