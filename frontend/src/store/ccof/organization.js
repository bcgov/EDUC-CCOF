import { isEqual } from 'lodash';
import { defineStore } from 'pinia';

import ApiService from '@/common/apiService.js';
import ApplicationService from '@/services/applicationService';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/auth.js';
import { useEceweAppStore } from '@/store/eceweApp.js';
import { useNavBarStore } from '@/store/navBar.js';
import { ApiRoutes, ORGANIZATION_PROVIDER_TYPES, ORGANIZATION_PROVIDER_TYPES_IDS } from '@/utils/constants.js';
import { checkSession } from '@/utils/session.js';

export const useOrganizationStore = defineStore('organization', {
  state: () => ({
    organizationId: null,
    organizationProviderType: null,
    organizationName: null,
    organizationAccountNumber: null,
    isOrganizationComplete: false,
    organizationModel: {},
    loadedModel: {},
  }),
  actions: {
    setOrganizationId(organizationId) {
      this.organizationId = organizationId;
    },
    setOrganizationProviderType(organizationProviderType) {
      this.organizationProviderType = organizationProviderType;
    },
    setOrganizationName(organizationName) {
      this.organizationName = organizationName;
    },
    setOrganizationAccountNumber(organizationAccountNumber) {
      this.organizationAccountNumber = organizationAccountNumber;
    },
    setOrganizationModel(model) {
      this.organizationModel = { ...model };
    },
    setLoadedModel(model) {
      this.loadedModel = { ...model };
    },
    setIsOrganizationComplete(value) {
      this.isOrganizationComplete = value;
    },
    async saveOrganization() {
      checkSession();
      const appStore = useAppStore();
      const applicationStore = useApplicationStore();
      const authStore = useAuthStore();
      const navBarStore = useNavBarStore();

      if (isEqual({ ...this.organizationModel, providerType: null }, { ...this.loadedModel, providerType: null })) {
        return;
      }

      const payload = {
        ...this.organizationModel,
        applicationTemplateVersion: ApplicationService.getActiveApplicationTemplate(),
      };
      payload.providerType = this.getOrgProviderTypeID;
      //update the loaded model here before the same, otherwise errors will prevent you from leaving the page
      this.setLoadedModel({ ...this.organizationModel });
      navBarStore.forceNavBarRefresh(null);
      if (this.organizationId) {
        // has an organization ID, so update the data
        try {
          const response = await ApiService.apiAxios.put(`${ApiRoutes.ORGANIZATION}/${this.organizationId}`, payload);
          authStore.userInfo.organizationName = this.organizationModel.legalName;
          return response;
        } catch (error) {
          console.log(`Failed to update existing Organization - ${error}`);
          throw error;
        }
      } else {
        //we calculate which app to use in lookup - no need to do it again here
        const programYear = appStore.programYearList.newApp;
        payload.programYearId = programYear.programYearId;
        applicationStore.setProgramYearId(programYear.programYearId);
        applicationStore.setProgramYearLabel(programYear.name);
        try {
          const response = await ApiService.apiAxios.post(ApiRoutes.ORGANIZATION, payload);
          this.setOrganizationId(response.data?.organizationId);
          this.setOrganizationProviderType(response.data?.organizationProviderType);
          applicationStore.setApplicationId(response.data?.applicationId);
          applicationStore.setApplicationStatus(response.data?.applicationStatus);
          applicationStore.setApplicationType(response.data?.applicationType);
          applicationStore.setCcofApplicationStatus('NEW');
          authStore.userInfo.organizationName = this.organizationModel.legalName;
          return response;
        } catch (error) {
          console.log(`Failed to save new Organization - ${error}`);
          throw error;
        }
      }
    },
    async renewApplication() {
      const appStore = useAppStore();
      const applicationStore = useApplicationStore();
      const authStore = useAuthStore();
      const eceweAppStore = useEceweAppStore();

      checkSession();
      const nextApp = appStore.programYearList?.list?.find(
        (el) => el.previousYearId == applicationStore.latestProgramYearId,
      );
      const payload = {
        providerType: this.organizationProviderType,
        programYearId: nextApp?.programYearId,
        applicationTemplateVersion: ApplicationService.getActiveApplicationTemplate(),
        organizationId: this.organizationId,
      };
      try {
        const response = await ApiService.apiAxios.post(ApiRoutes.APPLICATION_RENEW, payload);
        eceweAppStore.setIsStarted(false);
        authStore.setIsUserInfoLoaded(false);

        return response;
      } catch (error) {
        console.log(`Failed to renew Application - ${error}`);
        throw error;
      }
    },

    async loadOrganization(organizationId) {
      checkSession();

      try {
        const response = await ApiService.apiAxios.get(`${ApiRoutes.ORGANIZATION}/${organizationId}`);
        this.setOrganizationModel(response.data);
        this.setLoadedModel(response.data);
        this.setIsOrganizationComplete(response.data?.isOrganizationComplete);
      } catch (error) {
        console.log(`Failed to get Organization - ${error}`);
        throw error;
      }
    },
  },
  getters: {
    getOrgProviderTypeID(state) {
      if (state.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP) {
        return ORGANIZATION_PROVIDER_TYPES_IDS.GROUP;
      }
      return ORGANIZATION_PROVIDER_TYPES_IDS.FAMILY;
    },
  },
});
