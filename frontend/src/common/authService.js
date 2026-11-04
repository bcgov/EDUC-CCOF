import axios from 'axios';
import { AuthRoutes } from '../utils/constants.js';
import { updateServerClock } from '../utils/serverClock.js';

export default {
  //Retrieves an auth token from the API endpoint
  async getAuthToken() {
    try {
      const response = await axios.get(AuthRoutes.TOKEN);
      updateServerClock(response.data?.serverTime);
      return response.data;
    } catch (e) {
      console.log(`Failed to acquire JWT token - ${e}`);
      throw e;
    }
  },

  //Refreshes the users auth token
  async refreshAuthToken(token) {
    try {
      const response = await axios.post(AuthRoutes.REFRESH, {
        refreshToken: token,
      });

      if (response && response.data && response.data.error) {
        return { error: response.data.error_description };
      }
      updateServerClock(response.data?.serverTime);
      return response.data;
    } catch (e) {
      console.log(`Failed to refresh JWT token - ${e}`);
      throw e;
    }
  },
};
