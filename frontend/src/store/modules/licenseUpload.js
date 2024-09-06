import ApiService from '../../common/apiService';
import {ApiRoutes} from '../../utils/constants';

export default {
  namespaced: true,
  state: {
    uploadedLicenses: []
  },
  getters: {
    getUploadedLicenses: (state) => state.uploadedLicenses,

  },
  mutations: {
    setUploadedLicenses: (state, persistedLicenses) => {
      state.uploadedLicenses = persistedLicenses;
    }
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    async saveLicenseFiles({state},payload) {
      try {
        let response = await ApiService.apiAxios.post(ApiRoutes.LICENSE_UPLOAD, payload);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async getLicenseFiles({commit},applicationId){
      try {
        commit('setUploadedLicenses',[]);
        let response = await ApiService.apiAxios.get(ApiRoutes.LICENSE_UPLOAD+ '/' + applicationId);
        commit('setUploadedLicenses',response.data);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    // eslint-disable-next-line no-unused-vars
    async deleteLicenseFiles({state},payload){
      try {
        await ApiService.apiAxios.delete(ApiRoutes.LICENSE_UPLOAD, { data: payload} );
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
};
