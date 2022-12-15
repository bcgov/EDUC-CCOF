import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import {isEmpty} from 'lodash';


export default {
  namespaced: true,
  state: {
    model: [
    ],
    foo: 'bar',
    // facilityList: [],
    facilityStore: {},
    facilityModel: {},
    facilityId: null,
    ccfriChildCareTypes: [],
    // CCFRIFacilityModel : {}, //jb
    // ccfriId: {},//jb
    // ccfriStore :{},
    isValidForm: false,
  },
  getters: {
    isCurrentFacilityComplete: state => state.isValidForm,
    getFacilityById: (state) => (facilityId) => { 
      return state.facilityStore[facilityId];
    },
    // getCCFRIById: (state) => (ccfriId) => { 
    //   return state.ccfriStore[ccfriId];
    // },
    isNewFacilityStarted: state => !isEmpty(state.facilityModel),

    getModel: state => {return state.model;}
  },  
  mutations: {
    model(state, value) {
      state.model = value;
    },
    isValidForm(state, value) {
      state.isValidForm = value;
    },
    // setFacilityList: (state, facilityList) => { state.facilityList = facilityList; },
    // addToFacilityList: (state, payload) => { state.facilityList.push (payload); },
    setFacilityModel: (state, facilityModel) => { state.facilityModel = facilityModel; },
    // setCCFRIFacilityModel: (state, CCFRIFacilityModel) => { state.CCFRIFacilityModel = CCFRIFacilityModel; }, //jb
    setFacilityId: (state, facilityId) => { state.facilityId = facilityId; },
    setCcfriChildCareTypes: (state, ccfriChildCareTypes) => { state.ccfriChildCareTypes = ccfriChildCareTypes; },
    // setCcfriId: (state, ccfriId) => { state.ccfriId = ccfriId; },
    addFacilityToStore: (state, {facilityId, facilityModel} ) => {
      if (facilityId) {
        state.facilityStore[facilityId] = facilityModel;  
      }
    },
    // addCCFRIToStore: (state, {ccfriId, CCFRIFacilityModel} ) => {
    //   if (ccfriId) {
    //     state.ccfriStore[ccfriId] = CCFRIFacilityModel;  
    //   }
    // }
  },
  actions: {
    async saveFacility({ state, commit, rootState }) {
      let organizationId = rootState.organization.organizationId;
      if (!organizationId) {
        console.log('unable to save facility because you are not associated to an organization');
        throw 'unable to save facility because you are not associated to an organization';
      }
      if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
        console.log('unable to save because you are not logged in');
        throw 'unable to save because you are not logged in';
      }
      let payload = { ...state.facilityModel, organizationId,  applicationId:rootState.organization.applicationId};
      if (state.facilityId) {
        // has an orgaization ID, so update the data
        try {
          let response = await ApiService.apiAxios.put(ApiRoutes.FACILITY + '/' + state.facilityId, payload);

          commit('setFacilityModel', response.data);
          commit('addFacilityToStore', {facilityId: state.facilityId, facilityModel: response.data});
          return response;
        } catch (error) {
          console.log(`Failed to update existing Facility - ${error}`);
          throw error;
        }
      } else {
        // else create a new facility
        try {
          let response = await ApiService.apiAxios.post(ApiRoutes.FACILITY, payload);
          commit('setFacilityId', response.data?.facilityId);
          commit('app/addToNavBarList', {
            facilityName: state.facilityModel.facilityName,
            facilityId: state.facilityId,
            ccofBaseFundingId: response.data?.ccofBaseFundingId,
            ccofBaseFundingStatus: response.data?.ccofBaseFundingStatus
          }, { root: true });
          return response;
        } catch (error) {
          console.log(`Failed to save new Facility - ${error}`);
          throw error;
        }
      }
    },
    async loadFacility({getters, commit}, facilityId) {
      commit('setFacilityId', facilityId);
      let facilityModel = getters.getFacilityById(facilityId);
      if (facilityModel) {
        console.log('found facility for guid: ', facilityId);
        commit('setFacilityModel', facilityModel);
      } else {
        if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
          console.log('unable to load facility because you are not logged in');
          throw 'unable to  load facility because you are not logged in';
        }
        try {
          let response = await ApiService.apiAxios.get(ApiRoutes.FACILITY + '/' + facilityId);
          commit('addFacilityToStore', {facilityId: facilityId, facilityModel: response.data});
          commit('setFacilityModel', response.data);
          return response;

        } catch(e) {
          console.log(`Failed to get existing Facility with error - ${e}`);
          throw e;
        }
      }
    },
    async loadFacilityCareTypes({commit}, facilityId) {
      try {
        let response = await ApiService.apiAxios.get(`${ApiRoutes.FACILITY}/${facilityId}/licenseCategories`); 
        console.log('reponse is is: ', response); //?
        let careTypes = [];
        response.data.forEach(item => {
          careTypes.push( {
            programYear: '2021/22 FY',
            programYearId: 'abc',
            ...item
          });
        });
        response.data.forEach(item => {
          careTypes.push( {
            programYear: '2022/23 FY',
            programYearId: 'ddsd',
            ...item
          });
        });        
        commit('setCcfriChildCareTypes', careTypes);
        return response;
      } catch(e) {
        console.log(`Failed to get existing Facility with error - ${e}`);
        throw e;
      }
    },


    // async loadCCFRIFacility({getters, commit}, ccfriId) {
    //   commit('setCcfriId', ccfriId);
    //   let CCFRIFacilityModel = getters.getCCFRIById(ccfriId); //maybe change getFacilityById as well?
    //   if (CCFRIFacilityModel) {
    //     //console.log('found CCFRI data for guid: ', ccfriId);
    //     commit('setCCFRIFacilityModel', CCFRIFacilityModel);
    //   } else {
    //     if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
    //       console.log('unable to load facility because you are not logged in');
    //       throw 'unable to  load facility because you are not logged in';
    //     }
    //     try {//chucking in CCFRI application GUID for science 
    //       let response = await ApiService.apiAxios.get(`${ApiRoutes.CCFRIFACILITY}/${ccfriId}`); //call the new endpoint 
    //       commit('addCCFRIToStore', {ccfriId: ccfriId, CCFRIFacilityModel: response.data});                       ///////////////
    //       commit('setCCFRIFacilityModel', response.data);
    //       //commit('model', response.data);
    //       //console.log('model is: ', getters.getModel()); //?
    //       return response;

    //     } catch(e) {
    //       console.log(`Failed to get existing Facility with error - ${e}`);
    //       throw e;
    //     }
    //     //I want to add the call to load the CCFRI fees here also..
    //   }
    // },
    newFacility({commit}) {
      commit('setFacilityId', null);
      commit('setFacilityModel', {});
    }
  },
};
