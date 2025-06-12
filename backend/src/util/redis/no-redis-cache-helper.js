'use strict';
const log = require('../../components/logger');

const cacheHelper = {
  async getGuidE(guid) {
    return guid;
  },
  async getGuidD(guid) {
    return guid;
  },
  async getFacility(_guidd) {
    return null;
  },
  async setFacility(_guidd, _facility) {
    log.warn('Using local cache helper.  this does nothing!');
  },
};

module.exports = cacheHelper;
