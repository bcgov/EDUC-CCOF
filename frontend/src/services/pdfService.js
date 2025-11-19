import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session.js';

export default {
  async getPDFs(organizationId) {
    checkSession();
    try {
      const response = await ApiService.apiAxios.get(`${ApiRoutes.PDFS}/${organizationId}`);
      return response?.data;
    } catch (e) {
      console.log(`Failed to get pdfs with error - ${e}`);
      throw e;
    }
  },
};
