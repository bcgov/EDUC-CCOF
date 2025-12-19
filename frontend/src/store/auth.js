import { defineStore } from 'pinia';

import ApiService from '@/common/apiService.js';
import AuthService from '@/common/authService.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useNavBarStore } from '@/store/navBar.js';
import { ROLES } from '@/utils/constants.js';

function isExpiredToken(jwtToken) {
  const now = Date.now().valueOf() / 1000;
  const jwtPayload = jwtToken.split('.')[1];
  const payload = JSON.parse(window.atob(jwtPayload));
  return payload.exp <= now;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    acronyms: [],
    isAuthenticated: false,
    isUserInfoLoaded: false,
    userInfo: null,
    error: false,
    isMinistryUser: false,
    impersonateId: null,
    isImpersonating: false,
    isLoading: true,
    loginError: false,
    jwtToken: localStorage.getItem('jwtToken'),
    permissions: [],
  }),
  getters: {
    hasPermission: (state) => {
      return (permissions) => {
        const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
        return state.permissions?.some((p) => requiredPermissions.includes(p));
      };
    },
    isFacilityAdmin: (state) => {
      return (
        state.userInfo?.role?.roleNumber === ROLES.FAC_ADMIN_ADVANCED ||
        state.userInfo?.role?.roleNumber === ROLES.FAC_ADMIN_BASIC
      );
    },
  },
  actions: {
    //sets Json web token and determines whether user is authenticated
    setJwtToken(token = null) {
      if (token) {
        this.isAuthenticated = true;
        this.jwtToken = token;
        localStorage.setItem('jwtToken', token);
      } else {
        this.isAuthenticated = false;
        this.jwtToken = null;
        localStorage.removeItem('jwtToken');
      }
    },
    setIsUserInfoLoaded(isUserInfoLoaded) {
      this.isUserInfoLoaded = isUserInfoLoaded;
    },
    setUserInfo(userInfo = null) {
      this.userInfo = userInfo;
    },
    setLoginError() {
      this.loginError = true;
    },
    setError(error) {
      this.error = error;
    },

    setLoading(isLoading) {
      this.isLoading = isLoading;
    },
    setIsMinistryUser(isMinistryUser) {
      this.isMinistryUser = isMinistryUser;
    },
    setImpersonateId(impersonateId) {
      this.impersonateId = impersonateId;
    },
    loginErrorRedirect() {
      this.setLoginError();
    },
    logout() {
      this.setJwtToken();
      this.setUserInfo();
    },
    async getUserInfo(_to) {
      //This method is called by the router.
      //Only hit the API service if the info has not already been loaded.
      if (!this.isUserInfoLoaded) {
        const applicationStore = useApplicationStore();
        const navBarStore = useNavBarStore();
        const organizationStore = useOrganizationStore();

        let userInfoRes;
        if (this.impersonateId && this.isMinistryUser) {
          userInfoRes = await ApiService.getUserImpersonateInfo(this.impersonateId);
          this.isImpersonating = true;
        } else {
          userInfoRes = await ApiService.getUserInfo();
        }
        this.setUserInfo(userInfoRes.data);

        // Lookup the permissions
        const appStore = useAppStore();
        const role = appStore.roles.find((role) => role.roleId === this.userInfo.role?.roleId);
        this.permissions = role?.permissions.map((p) => p.permissionNumber);

        applicationStore.addApplicationsToMap(userInfoRes.data.applications);
        await applicationStore.loadApplicationFromStore(applicationStore.latestProgramYearId);

        // page will break if it's a new application and there is no facility list yet, below code fixes that.
        if (applicationStore?.applicationMap?.size > 0) {
          const latestApplication = applicationStore?.applicationMap?.get(applicationStore.latestProgramYearId);
          navBarStore.setUserProfileList(latestApplication?.facilityList);
          organizationStore.setOrganizationProviderType(latestApplication?.organizationProviderType);
          navBarStore.setApplicationStatus([
            latestApplication?.applicationStatus,
            latestApplication?.ccofApplicationStatus,
          ]);
        }
        organizationStore.setOrganizationId(userInfoRes.data.organizationId);
        organizationStore.setOrganizationName(userInfoRes.data?.organizationName);
        organizationStore.setOrganizationAccountNumber(userInfoRes.data?.organizationAccountNumber);
        organizationStore.setIsOrganizationComplete(userInfoRes.data.isOrganizationComplete);
        this.setIsUserInfoLoaded(true);
        this.setIsMinistryUser(userInfoRes.data.isMinistryUser);
      }
    },
    async refreshToken() {
      if (isExpiredToken(this.jwtToken)) {
        this.logout();
        return;
      }
      const response = await AuthService.refreshAuthToken(this.jwtToken);
      if (response.jwtFrontend) {
        this.setJwtToken(response.jwtFrontend);
        ApiService.setAuthHeader(response.jwtFrontend);
      } else {
        throw 'No jwtFrontend';
      }
    },
    async getInitialToken() {
      const response = await AuthService.getAuthToken();
      if (response.jwtFrontend) {
        this.setJwtToken(response.jwtFrontend);
        ApiService.setAuthHeader(response.jwtFrontend);
      } else {
        throw 'No jwtFrontend';
      }
    },
    // retrieves the json web token from local storage. If not in local storage, retrieves it from API
    async getJwtToken() {
      this.setError(false);
      if (this.jwtToken) {
        await this.refreshToken(this.jwtToken);
      } else {
        await this.getInitialToken();
      }
    },
  },
});
