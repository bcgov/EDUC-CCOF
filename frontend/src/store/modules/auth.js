import ApiService from '@/common/apiService';
import AuthService from '@/common/authService';
// import router from '@/router';
// import { AuthRoutes } from '@/utils/constants';
//
function isFollowUpVisit({jwtToken}) {
  return !!jwtToken;
}

function isExpiredToken(jwtToken) {
  const now = Date.now().valueOf() / 1000;
  const jwtPayload = jwtToken.split('.')[1];
  const payload = JSON.parse(window.atob(jwtPayload));
  // console.log(`Local test of JSON token: [${payload.exp}], with date: [${(new Date(payload.exp * 1000))}] is expired: [${payload.exp <= now}]`);
  return payload.exp <= now;
}

async function refreshToken({getters, commit, dispatch}) {
  if (isExpiredToken(getters.jwtToken)) {
    dispatch('logout');
    return;
  }

  const response = await AuthService.refreshAuthToken(getters.jwtToken);
  if (response.jwtFrontend) {
    commit('setJwtToken', response.jwtFrontend);
    ApiService.setAuthHeader(response.jwtFrontend);
  } else {
    throw 'No jwtFrontend';
  }
}

async function getInitialToken({commit}) {
  const response = await AuthService.getAuthToken();
  console.log('TOKEN Received: ' + response);
  if (response.jwtFrontend) {
    commit('setJwtToken', response.jwtFrontend);
    ApiService.setAuthHeader(response.jwtFrontend);
  } else {
    throw 'No jwtFrontend';
  }
}

export default {
  namespaced: true,
  state: {
    acronyms: [],
    isAuthenticated: false,
    isUserInfoLoaded: false,
    userInfo: null,
    error: false,
    isMinistryUser: false,
    impersonateId: null,
    isLoading: true,
    loginError: false,
    jwtToken: localStorage.getItem('jwtToken'),
  },
  getters: {
    acronyms: state => state.acronyms,
    isAuthenticated: state => state.isAuthenticated,
    jwtToken: state => state.jwtToken,
    userInfo: state => state.userInfo,
    loginError: state => state.loginError,
    error: state => state.error,
    isLoading: state => state.isLoading,
    isMinistryUser: state => state.isMinistryUser,
  },
  mutations: {
    //sets Json web token and determines whether user is authenticated
    setJwtToken: (state, token = null) => {
      if (token) {
        state.isAuthenticated = true;
        state.jwtToken = token;
        localStorage.setItem('jwtToken', token);
      } else {
        state.isAuthenticated = false;
        state.jwtToken = null;
        localStorage.removeItem('jwtToken');
      }
    },
    setIsUserInfoLoaded: (state, isUserInfoLoaded) => {
      state.isUserInfoLoaded = isUserInfoLoaded;
    },
    setUserInfo: (state, userInfo) => {
      if(userInfo){
        state.userInfo = userInfo;
      } else {
        state.userInfo = null;
      }
    },
    setLoginError: (state) => {
      state.loginError = true;
    },
    setError: (state, error) => {
      state.error = error;
    },

    setLoading: (state, isLoading) => {
      state.isLoading = isLoading;
    },
    setIsMinistryUser: (state, isMinistryUser) => {
      state.isMinistryUser = isMinistryUser;
    },
    setImpersonateId: (state, impersonateId) => {
      state.impersonateId = impersonateId;
    },
  },
  actions: {
    loginErrorRedirect(context){
      context.commit('setLoginError');
    },
    logout(context) {
      context.commit('setJwtToken');
      context.commit('setUserInfo');
    },
    async getUserInfo({state, commit, dispatch, rootState, rootGetters}, to){


      //This method is called by the router.
      //Only hit the API service if the info has not already been loaded.
      if (!state.isUserInfoLoaded) {
        let userInfoRes = undefined;
        if (state.impersonateId && state.isMinistryUser) {
          userInfoRes = await ApiService.getUserImpersonateInfo(state.impersonateId);
        } else {
          userInfoRes = await ApiService.getUserInfo();
        }
        commit('setUserInfo', userInfoRes.data);
<<<<<<< HEAD
        commit('application/addApplicationsToMap', userInfoRes.data.applications, { root: true });
        await dispatch('application/loadApplicationFromStore', rootGetters['application/latestProgramYearId'], { root: true });

        //page will break if it's a new application and there is no facility list yet, below code fixes that.
        if (rootState.application?.applicationMap?.size > 0){
          commit('navBar/setUserProfileList', rootState.application?.applicationMap?.get(rootGetters['application/latestProgramYearId']).facilityList, { root: true });
        }
=======
        commit('application/setFromUserInfo', userInfoRes.data, { root: true });
        commit('navBar/setUserProfileList', userInfoRes.data.facilityList, { root: true });
        commit('navBar/setIsRenewal', (userInfoRes.data.applicationType === 'RENEW'), { root: true });
        commit('navBar/setApplicationStatus', [userInfoRes.data.applicationStatus, userInfoRes.data.ccofApplicationStatus], { root: true });
        commit('app/setIsRenewal', (userInfoRes.data.applicationType === 'RENEW'), { root: true });
>>>>>>> 8c5197e8663fccaa06f5d9215e664cd5d8325d8d
        commit('organization/setOrganizationId', userInfoRes.data.organizationId, { root: true });
        commit('organization/setOrganizationProviderType', userInfoRes.data.organizationProviderType, { root: true });
        commit('organization/setOrganizationName', userInfoRes.data?.organizationName, { root: true });
        commit('organization/setOrganizationAccountNumber', userInfoRes.data?.organizationAccountNumber, { root: true });
        commit('organization/setFundingAgreementNumber', userInfoRes.data?.fundingAgreementNumber, { root: true });
        commit('organization/setIsOrganizationComplete', userInfoRes.data.isOrganizationComplete, { root: true });
        commit('reportChanges/setUserProfileChangeRequests', userInfoRes.data.changeRequests, { root: true });
        commit('setIsUserInfoLoaded', true);
        commit('setIsMinistryUser', userInfoRes.data.isMinistryUser);
      }
      if (to?.params?.changeRecGuid) {
        await dispatch('navBar/loadChangeRequest', to.params.changeRecGuid,  { root: true });
      }
    },

    //retrieves the json web token from local storage. If not in local storage, retrieves it from API
    async getJwtToken(context) {
      context.commit('setError', false);
      if (isFollowUpVisit(context.getters)) {
        await refreshToken(context);
      } else {  //inital login and redirect
        await getInitialToken(context);
      }
    },
  }
};
