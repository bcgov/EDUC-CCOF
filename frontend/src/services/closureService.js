import { isEmpty } from 'lodash';

import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getOrganizationClosures(organizationId, programYearId) {
    try {
      if (!organizationId || !programYearId) return [];
      const response = await ApiService.apiAxios.get(
        `${ApiRoutes.CLOSURES}?organizationId=${organizationId}&programYearId=${programYearId}`,
      );
      return response?.data;
    } catch (error) {
      console.log(`Failed to get organization closures - ${error}`);
      throw error;
    }
  },

  async createNewClosureChangeRequest(payload) {
    payload.applicationId = 'c887c859-4df9-ef11-bae1-7ced8d05e0a9';
    payload.programYearId = 'fdc2fce3-d1a2-ef11-8a6a-000d3af474a4';
    payload.facilityId = 'e4077ebe-0310-f011-9989-000d3a09ed17';
    payload.startDate = '01/01/2024';
    payload.endDate = '01/01/2024';
    payload.paidClosure = true;
    payload.fullClosure = true;
    payload.ageGroups = [];
    payload.closureReason = 'to close';
    payload.description = 'closing';
    payload.documents = [];
    payload.changeType = 'NEW_CLOSURE';
    try {
      // if (isEmpty(payload)) return;
      await ApiService.apiAxios.post(ApiRoutes.CHANGE_REQUEST_NEW_CLOSURE, payload);
    } catch (error) {
      console.log(`Failed to create organization closure request - ${error}`);
      throw error;
    }
  },
};

// const changeRequestPayload = {
//   applicationId: applicationStore.applicationId,
//   programYearId: applicationStore.programYearId,
//   changeType: 'NEW_FACILITY',
// };
// const changeRequestResponse = await ApiService.apiAxios.post(
//   ApiRoutes.CHANGE_REQUEST_NEW_FAC,
//   changeRequestPayload,
// );
