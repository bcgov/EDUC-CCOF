import ApiService from '../common/apiService';
import { ApiRoutes } from '../utils/constants';
import { checkSession } from '../utils/session';

export default {
  async getFundingAgreements(organizationId) {
    checkSession();
    try {
      if (!organizationId) return [];
      const response = await ApiService.apiAxios.get(
        `${ApiRoutes.FUNDING_AGREEMENTS}?organizationId=${organizationId}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to load funding agreements - ${error}`);
      throw error;
    }
  },

  async getFundingAgreement(fundingAgreementId) {
    checkSession();
    try {
      if (!fundingAgreementId) return [];
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FUNDING_AGREEMENTS}/${fundingAgreementId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to load funding agreement - ${error}`);
      throw error;
    }
  },

  async getFundingAgreementPDF(fundingAgreementId) {
    try {
      if (!fundingAgreementId) return;
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FUNDING_AGREEMENTS}/${fundingAgreementId}/pdf`);
      return response.data;
    } catch (error) {
      console.log(`Failed to get the funding PDF by funding id - ${error}`);
      throw error;
    }
  },

  async updateFundingAgreement(fundingAgreementId, payload) {
    try {
      if (!fundingAgreementId) return;
      const response = await ApiService.apiAxios.patch(
        `${ApiRoutes.FUNDING_AGREEMENTS}/${fundingAgreementId}`,
        payload,
      );
      return response?.data;
    } catch (error) {
      console.log(`Failed to update the Funding Agreement - ${error}`);
      throw error;
    }
  },
};
