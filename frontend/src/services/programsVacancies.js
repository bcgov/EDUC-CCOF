import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getProgramsVacancies(facilityId) {
    try {
      if (!facilityId) return [];
      const response = await ApiService.apiAxios.get(`${ApiRoutes.PROGRAMS_VACANCIES}?facilityId=${facilityId}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get Programs and Vacancies by facilityId - ${error}`);
      throw error;
    }
  },

  async updateProgramsVacancies(programsVacanciesId, payload) {
    try {
      if (!programsVacanciesId) return [];
      const response = await ApiService.apiAxios.patch(
        `${ApiRoutes.PROGRAMS_VACANCIES}/${programsVacanciesId}`,
        payload,
      );
      return response?.data;
    } catch (error) {
      console.log(`Failed to update Programs and Vacancies by programsVacanciesId - ${error}`);
      throw error;
    }
  },
};
