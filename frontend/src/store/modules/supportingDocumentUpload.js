import ApiService from '@/common/apiService';
import {ApiRoutes} from '@/utils/constants';

export default {
  namespaced: true,
  state: {
    uploadedDocuments: []
  },
  getters: {
    getUploadedDocuments: (state) => state.uploadedDocuments,

  },
  mutations: {
    setUploadedDocuments: (state, uploadedDocuments) => {
      state.uploadedDocuments = uploadedDocuments;
    }
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    async saveUploadedDocuments({state},payload) {
      console.log('save uploaded documents called');
      try {
        let response = await ApiService.apiAxios.post(ApiRoutes.SUPPORTING_DOCUMENT_UPLOAD, payload);
        console.log('save uploaded documents called');
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async getDocuments({commit},applicationId){
      try {
        commit('setUploadedDocuments',[]);
        let response = await ApiService.apiAxios.get(ApiRoutes.SUPPORTING_DOCUMENT_UPLOAD+ '/' + applicationId);
        commit('setUploadedDocuments',response.data);
        console.log('get documents called');
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    // eslint-disable-next-line no-unused-vars
    async deleteDocuments({state},deletedFiles){
      try {
        await ApiService.apiAxios.delete(ApiRoutes.SUPPORTING_DOCUMENT_UPLOAD, { data: deletedFiles} );
        console.log('delete uploaded documents called');
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

  },
};
