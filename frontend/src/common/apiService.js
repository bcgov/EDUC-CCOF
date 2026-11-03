import axios from 'axios';

import { ApiRoutes } from '../utils/constants.js';
import AuthService from './authService.js';

// Concurrent 401s share a single in-flight refresh so the session's refresh token is only rotated once
let pendingRefresh = null;

function refreshToken() {
  if (!pendingRefresh) {
    pendingRefresh = AuthService.refreshAuthToken(localStorage.getItem('jwtToken'))
      .then((response) => {
        if (!response?.jwtFrontend) {
          throw new Error('No jwtFrontend returned from token refresh');
        }
        localStorage.setItem('jwtToken', response.jwtFrontend);
        apiAxios.defaults.headers.common['Authorization'] = `Bearer ${response.jwtFrontend}`;
        return response.jwtFrontend;
      })
      .finally(() => {
        pendingRefresh = null;
      });
  }
  return pendingRefresh;
}

// Create new non-global axios instance and intercept strategy
const apiAxios = axios.create();
const intercept = apiAxios.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;
    console.log('ERROR', error);
    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      throw error;
    }
    originalRequest._retry = true;
    try {
      const token = await refreshToken();
      originalRequest.headers['Authorization'] = `Bearer ${token}`;
    } catch (e) {
      localStorage.removeItem('jwtToken');
      window.location = '/token-expired';
      throw e;
    }
    return apiAxios(originalRequest);
  },
);

export default {
  apiAxios: apiAxios,
  intercept: intercept,

  //Adds required headers to the Auth request
  setAuthHeader(token) {
    if (token) {
      apiAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiAxios.defaults.headers.common['Authorization'];
    }
  },

  async getUserInfo() {
    try {
      return await apiAxios.get(ApiRoutes.USER);
    } catch (e) {
      console.log(`Failed to get from Nodejs getUserInfo API - ${e}`);
      throw e;
    }
  },

  async getUserImpersonateInfo(userName) {
    try {
      return await apiAxios.get(`${ApiRoutes.USER}/${userName}`);
    } catch (e) {
      console.log(`Failed to get from Nodejs getUserImpersonateInfo API - ${e}`);
      throw e;
    }
  },

  async getLookupInfo() {
    try {
      return await apiAxios.get(ApiRoutes.LOOKUP);
    } catch (e) {
      console.log(`Failed to get from Nodejs getLookups API - ${e}`);
      throw e;
    }
  },

  async getConfig(configName) {
    try {
      const queryParams = {
        params: {
          configName: configName,
        },
      };
      const response = await apiAxios.get(ApiRoutes.CONFIG, queryParams);
      return response.data.configValue;
    } catch (e) {
      console.log(`Failed to do get from Nodejs getConfig API - ${e}`);
      throw e;
    }
  },
  getExchangeStatuses: getCodes(`${ApiRoutes.LOOKUPS}`),
};
function getCodes(url) {
  return async function getCodesHandler(query) {
    try {
      return await apiAxios.get(url, query);
    } catch (e) {
      console.log(`Failed to get from Nodejs API - ${e}`);
      throw e;
    }
  };
}
