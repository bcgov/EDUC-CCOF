import ApiService from '@/common/apiService';
//import {getData, postData} from '@/store/modules/helpers';
import {checkSession} from '@/utils/session';
import {ApiRoutes} from '@/utils/constants';

export default {
  namespaced: true,
  state: {
    documentTypeCodes: null,
    unsubmittedDocuments: [],
    pdfs:[],
  },
  getters: {
    documentTypeCodes: state => state.documentTypeCodes,
    unsubmittedDocuments: state => state.unsubmittedDocuments,
    pdfs: state => state.pdfs,
  },
  mutations: {
    setPDFs: (state, pdfs) => {
      state.pdfs = pdfs;
    },
    setDocumentTypeCodes: (state, documentTypeCodes) => {
      state.documentTypeCodes = documentTypeCodes;
    },
    setUnsubmittedDocuments: (state, unsubmittedDocuments) => {
      state.unsubmittedDocuments = unsubmittedDocuments || [];
    },
    setUploadedDocument: (state, document) => {
      state.unsubmittedDocuments = [...state.unsubmittedDocuments, document];
    },
  },
  actions: {
    async getDocumentTypeCodes({commit}) {
      const response = await ApiService.getDocumentTypeCodes();
      commit('setDocumentTypeCodes', response.data);
    },
    async deleteFile({commit, getters}, {secureExchangeID, documentID}){
      await ApiService.deleteDocument(secureExchangeID, documentID);
      const documents = getters.unsubmittedDocuments.filter(document => document.documentID !== documentID);
      commit('setUnsubmittedDocuments', documents);
    },
    async getPDFs({commit}, applicationId) {
      console.log('trying to get pdfs for ', applicationId);
      checkSession();
      try {
        let response = (await ApiService.apiAxios.get(ApiRoutes.PDFS + '/' + applicationId))?.data;
        console.log('THIS IS PDFs RESPONSE = ');
        console.log(response);
        commit('setPDFs',response);
        return response;
      } catch(e) {
        console.log(`Failed to get pdfs with error - ${e}`);
        throw e;
      }
    },
    //getFileRequirements: () => getData(ApiService.getFileRequirements),
    //uploadFile: (_context, fileData) => postData(ApiService.uploadFile, _context, fileData),
  }
};
