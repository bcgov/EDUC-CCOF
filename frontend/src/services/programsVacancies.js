import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getprogramsVacancies(facilityId) {
    try {
      if (!facilityId) return [];
      const response = await ApiService.apiAxios.get(`${ApiRoutes.PROGRAMS_VACANCIES}?facilityId=${facilityId}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get the Programs and Vacancies by facilityId - ${error}`);
      throw error;
    }
  },
};
