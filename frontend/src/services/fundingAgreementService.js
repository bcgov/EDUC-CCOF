import { isEmpty } from 'lodash';

import ApiService from '@/common/apiService';
import { buildQueryString } from '@/utils/common.js';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';

export default {
  async getFundingAgreements(query) {
    try {
      const queryString = buildQueryString(query);
      if (isEmpty(queryString)) {
        return [];
      }
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FUNDING_AGREEMENTS}${queryString}`);
      return response?.data;
    } catch (error) {
      console.error(`Failed to get funding agreements - ${error}`);
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
      console.error(`Failed to get funding agreement - ${error}`);
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

  async getFundingAgreementWithPDFByQuery(query) {
    try {
      if (isEmpty(query)) return null;
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FUNDING_AGREEMENTS}/pdf${buildQueryString(query)}`);
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

  async checkFundingAgreementExists(query) {
    try {
      if (!query?.organizationId) return false;
      const response = await ApiService.apiAxios.get(
        `${ApiRoutes.FUNDING_AGREEMENTS}/exists${buildQueryString(query)}`,
      );
      return response?.data?.exists;
    } catch (error) {
      console.error(`Failed to check if Funding Agreement exists - ${error}`);
      throw error;
    }
  },
};
