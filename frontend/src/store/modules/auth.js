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
      // router.push(AuthRoutes.LOGOUT);
    },
    async getUserInfo({state, commit}){
      //This method is called by the router.
      //Only hit the API service if the info has not already been loaded.
      if (state.isUserInfoLoaded) {
        return;
      }
      let userInfoRes = undefined;
      if (state.impersonateId && state.isMinistryUser) {
        userInfoRes = await ApiService.getUserImpersonateInfo(state.impersonateId);
      } else {
        userInfoRes = await ApiService.getUserInfo();
      }
      
        
        
      commit('setUserInfo', userInfoRes.data);
      commit('app/bulkAddToNavNBar', userInfoRes.data.facilityList, { root: true });
      commit('app/setIsOrganizationComplete', userInfoRes.data.isOrganizationComplete, { root: true });
      commit('organization/setOrganizationId', userInfoRes.data.organizationId, { root: true });
      commit('organization/setApplicationId', userInfoRes.data.applicationId, { root: true });
      commit('organization/setApplicationStatus', userInfoRes.data.applicationStatus, { root: true });
      
      commit('setIsUserInfoLoaded', true);
      commit('setIsMinistryUser', userInfoRes.data.isMinistryUser);
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
