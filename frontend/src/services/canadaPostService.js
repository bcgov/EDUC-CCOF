import { isEmpty } from 'lodash';

import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async findAddressesBySearchTerm(searchTerm) {
    try {
      if (isEmpty(searchTerm)) return [];
      const response = await ApiService.apiAxios.get(`${ApiRoutes.CANADA_POST}/find?searchTerm=${searchTerm}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to find addresses by search term - ${error}`);
      throw error;
    }
  },
  async findAddressesByLastId(lastId) {
    try {
      if (isEmpty(lastId)) return [];
      const response = await ApiService.apiAxios.get(`${ApiRoutes.CANADA_POST}/find?lastId=${lastId}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to find addresses by last id - ${error}`);
      throw error;
    }
  },
};
