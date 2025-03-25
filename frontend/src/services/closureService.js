import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getCCFRIClosuresForFiscalYear(ccfriId, programYearId) {
    try {
      if (!ccfriId || !programYearId) return [];
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FACILITY}/closures/${ccfriId}/${programYearId}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get ccfri closures - ${error}`);
      throw error;
    }
  },
};
