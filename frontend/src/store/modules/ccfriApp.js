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
      let CCFRIFacilityModel = getters.getCCFRIById(ccfriId); 
      if (CCFRIFacilityModel) {
        //console.log('found CCFRI data for guid: ', ccfriId);
        commit('setCCFRIFacilityModel', CCFRIFacilityModel);
      } else {
        if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
          console.log('unable to load facility because you are not logged in');
          throw 'unable to  load facility because you are not logged in';
        }
        try {
          let response = await ApiService.apiAxios.get(`${ApiRoutes.CCFRIFACILITY}/${ccfriId}`); 
          commit('addCCFRIToStore', {ccfriId: ccfriId, CCFRIFacilityModel: response.data});                       
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

        console.log('resp:', response);
        response.data.forEach(item => {
          let found = state.CCFRIFacilityModel.childCareTypes.find(searchItem => {
            return (searchItem.childCareCategoryId == item.childCareCategoryId &&
            searchItem.programYearId == rootState.app.programYearList.current.programYearId);
          });
          if (!found) {
            careTypes.push( {
              programYear: rootState.app.programYearList.current.name,
              programYearId: rootState.app.programYearList.current.programYearId,
              current: 1, //jb - we found a valid liscence for this child care cat - but it doesn't exist on the CCFRI form yet 
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
              current: 1,
              ...item
            });
          }
        });
        console.log('len of childCareTypes before push: ',  state.CCFRIFacilityModel.childCareTypes.length); //from CCFRI form dynamics
       

        //if childcarecat GUID exists in childcaretypes but NOT in response - run delete
        //this handles the edge case of a user entering fees for CCFRI then going back to CCOF
        //and removing that child care type
        state.CCFRIFacilityModel.childCareTypes.forEach((childCareCat) => {
          console.log('care type guid:' , childCareCat.childCareCategoryId);

          let found = response.data.find(searchItem => {
            return (searchItem.childCareCategoryId == childCareCat.childCareCategoryId);
          });

          
          //Mark the child care type, and call the delete API with the parentFeeGUID
          if (!found) {
            childCareCat.deleteMe = true;
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

//
