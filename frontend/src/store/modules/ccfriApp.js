import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';


export default {
  namespaced: true,
  state: {
    isValidForm: undefined,
    model: [
      
    ],
    CCFRIFacilityModel : {},
    ccfriId: {},
    ccfriStore :{},
  },
  getters: {
    getCCFRIById: (state) => (ccfriId) => { 
      return state.ccfriStore[ccfriId];
    },
  },
  mutations: {
    model(state, value) {
      state.model = value;
    },
    isValidForm(state, value) {
      state.isValidForm = value;
    },
    setCCFRIFacilityModel: (state, CCFRIFacilityModel) => { state.CCFRIFacilityModel = CCFRIFacilityModel; }, //jb
    setCcfriId: (state, ccfriId) => { state.ccfriId = ccfriId; },
    addCCFRIToStore: (state, {ccfriId, CCFRIFacilityModel} ) => {
      if (ccfriId) {
        state.ccfriStore[ccfriId] = CCFRIFacilityModel;  
      }
    },
  },

  actions: {
    async loadCCFRIFacility({getters, commit}, ccfriId) {
      commit('setCcfriId', ccfriId);
      let CCFRIFacilityModel = getters.getCCFRIById(ccfriId); //maybe change getFacilityById as well?
      if (CCFRIFacilityModel) {
        //console.log('found CCFRI data for guid: ', ccfriId);
        commit('setCCFRIFacilityModel', CCFRIFacilityModel);
      } else {
        if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
          console.log('unable to load facility because you are not logged in');
          throw 'unable to  load facility because you are not logged in';
        }
        try {
          let response = await ApiService.apiAxios.get(`${ApiRoutes.CCFRIFACILITY}/${ccfriId}`); //call the new endpoint 
          commit('addCCFRIToStore', {ccfriId: ccfriId, CCFRIFacilityModel: response.data});                       ///////////////
          commit('setCCFRIFacilityModel', response.data);
        } catch(e) {
          console.log(`Failed to get existing Facility with error - ${e}`);
          throw e;
        }
        //I want to add the call to load the CCFRI fees here also..
      }
    },
    async decorateWithCareTypes({commit, state, rootState}, facilityId) {
      try {
        let response = await ApiService.apiAxios.get(`${ApiRoutes.FACILITY}/${facilityId}/licenseCategories`); 
        console.log('reponse is is: ', response); //?
        let careTypes = [];
        response.data.forEach(item => {
          let found = state.CCFRIFacilityModel.childCareTypes.find(searchItem => {
            return (searchItem.childCareCategoryId == item.childCareCategoryId &&
            searchItem.programYearId == rootState.app.programYearList.current.programYearId);
          });
          if (!found) {
            careTypes.push( {
              programYear: rootState.app.programYearList.current.name,
              programYearId: rootState.app.programYearList.current.programYearId,
              ...item
            });
          }
        });
        response.data.forEach(item => {
          let found = state.CCFRIFacilityModel.childCareTypes.find(searchItem => {
            return (searchItem.childCareCategoryId == item.childCareCategoryId &&
            searchItem.programYearId == rootState.app.programYearList.previous.programYearId);
          });
          if (!found) {
            careTypes.push( {
              programYear: rootState.app.programYearList.previous.name,
              programYearId: rootState.app.programYearList.previous.programYearId,
              ...item
            });
          }
        });
        state.CCFRIFacilityModel.childCareTypes.push(...careTypes);
        commit('setCCFRIFacilityModel', state.CCFRIFacilityModel);
      } catch (e) {
        console.log('error', e);
      }
    },
  }
};

//I would maybe like a way to load the CCFRI model data into here?
