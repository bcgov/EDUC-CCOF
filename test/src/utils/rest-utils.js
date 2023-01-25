const log = require('npmlog');
const axios = require('axios');
const lodash = require('lodash');
const config = require('../utils/configLoader');

const restService = {
  async  getOperation(operation) {
    try {
      const url = config.get('dynamicsApi:apiEndpoint') + '/api/Operations?statement=' + operation;
      const response = await axios.get(url, this.getHttpHeader());
      return response.data;
    } catch (e) {
      log.error('getOperation Error', e.response ? e.response.status : e.message);
    }
  },
  async deleteOperationWithObjectId(operation, objectId) {
    const operationWithObject = `${operation}(${objectId})`;
    return await this.deleteOperation(operationWithObject);
  },
  async deleteOperation(operation) {
    try {
      const url = config.get('dynamicsApi:apiEndpoint') + '/api/Operations?statement=' + operation;
      const response = await axios.delete(url, this.getHttpHeader());
      return response.data;
    } catch (e) {
      log.error('deleteOperation Error', e.response ? e.response.status : e.message);
    }
  },
   getHttpHeader() {
  let headers = null;
  if ('local' === config.get('environment')) {
    headers = {
      'Accept': 'text/plain',
      'Content-Type': 'application/json',
      'auth': {
        'username': config.get('dynamicsApi:devBasicAuthUser'),
        'password': config.get('dynamicsApi:devBasicAuthPass')
      }
    };
  } else {
    headers = {
      'Accept': 'text/plain',
      'Content-Type': 'application/json',
    };
  }
  return headers;
}

}
module.exports = restService;
