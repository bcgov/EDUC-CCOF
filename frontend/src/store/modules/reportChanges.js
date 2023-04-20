import ApiService from '@/common/apiService';
import {ApiRoutes} from '@/utils/constants';
import {checkSession} from '@/utils/session';


export default {
  namespaced: true,
  state: {
    requestChangeId: undefined,
    unsubmittedDocuments: [],
    model: {},


  },
  getters: {
    requestChangeId: state => state.requestChangeId,
    unsubmittedDocuments: state => state.unsubmittedDocuments,
  },
  mutations: {
    model(state, value) {
      state.model = value;
    },
    setRequestChangeId: (state, requestChangeId) => {
      state.requestChangeId = requestChangeId;
    },
    setUnsubmittedDocuments: (state, unsubmittedDocuments) => {
      state.unsubmittedDocuments = unsubmittedDocuments || [];
    },
    setUploadedDocument: (state, document) => {
      state.unsubmittedDocuments = [...state.unsubmittedDocuments, document];
    },
  },
  actions: {

  },

};
