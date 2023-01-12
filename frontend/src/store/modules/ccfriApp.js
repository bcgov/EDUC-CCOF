import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { isEmpty, isEqual, cloneDeep } from 'lodash';

function getProgramYear(selectedGuid, programYearList){
  const programYear = programYearList.find(({ programYearId }) =>  programYearId == selectedGuid );

  if(!programYear){
    console.log('SELECTED PROGRAM YEAR GUID NOT FOUND :( ');
    throw 'SELECTED PROGRAM YEAR GUID NOT FOUND :( ';
  }

  return programYear;
}


export default {
  namespaced: true,
  state: {
    isValidForm: undefined,
    model: [],
    loadedModel: {},
    CCFRIFacilityModel : {},
    ccfriId: {},
    ccfriStore :{},
  },
  getters: {
    getCCFRIById: (state) => (ccfriId) => { 
      return state.ccfriStore[ccfriId];
    },
    getClosureDateLength: (state) => {
      return state.CCFRIFacilityModel.dates.length;
    }
  },
  mutations: {
    model(state, value) { state.model = value;},
    isValidForm(state, value) { state.isValidForm = value; },
    setCCFRIFacilityModel: (state, CCFRIFacilityModel) => { state.CCFRIFacilityModel = CCFRIFacilityModel; }, //
    setLoadedModel: (state, loadedModel) => { state.loadedModel = loadedModel; }, //
    setCcfriId: (state, ccfriId) => { state.ccfriId = ccfriId; },
    addCCFRIToStore: (state, {ccfriId, CCFRIFacilityModel} ) => {
      if (ccfriId) {
        state.ccfriStore[ccfriId] = CCFRIFacilityModel;  
      }
    },
    deleteChildCareTypes(state) {
      state.CCFRIFacilityModel.childCareTypes.forEach (async (item, index) => {
        if (item.deleteMe){
          state.CCFRIFacilityModel.childCareTypes.splice(index, 1); 
        }
      });
    }
  },

  actions: {
    
    async loadCCFRIFacility({getters, commit}, ccfriId) {
      commit('setCcfriId', ccfriId);
      let CCFRIFacilityModel = getters.getCCFRIById(ccfriId); 
      if (CCFRIFacilityModel) {
        commit('setCCFRIFacilityModel', CCFRIFacilityModel);
        commit('setLoadedModel', _.cloneDeep(CCFRIFacilityModel)); //copy the data from the ccfri facility model into a new object - otherwsie loadedModel will change also when user modifes the page
      } else {
        if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
          console.log('unable to load facility because you are not logged in');
          throw 'unable to  load facility because you are not logged in';
        }
        try {
          let response = await ApiService.apiAxios.get(`${ApiRoutes.CCFRIFACILITY}/${ccfriId}`); 
          commit('addCCFRIToStore', {ccfriId: ccfriId, CCFRIFacilityModel: response.data});                       
          commit('setCCFRIFacilityModel', response.data);
          commit('setLoadedModel', _.cloneDeep(response.data));
         
        } catch(e) {
          console.log(`Failed to get existing Facility with error - ${e}`);
          throw e;
        }
      }
    },
    async decorateWithCareTypes({commit, state, rootState}, facilityId) {
      const  ccofProgramYearId = rootState.auth.userInfo.ccofProgramYearId;
      const programYearList = rootState.app.programYearList.list;

      try {
        let response = await ApiService.apiAxios.get(`${ApiRoutes.FACILITY}/${facilityId}/licenseCategories`); 
        let careTypes = [];
        //state.CCFRIFacilityModel.childCareTypes = []; //set to empty so if user changes yes/no selection, the cards update

        const currProgramYear = getProgramYear(ccofProgramYearId, programYearList);
        //maybe add error checking here? - undefined means we didn't find a valid program year 

        //Always show the current year fee cards
        response.data.forEach(item => {
          
          let found = state.CCFRIFacilityModel.childCareTypes.find(searchItem => { 
            return (searchItem.childCareCategoryId == item.childCareCategoryId &&
            searchItem.programYearId == ccofProgramYearId);
          });
          if (!found) {
            careTypes.push( {
              programYear: currProgramYear.name,
              programYearId: currProgramYear.programYearId,
              current: 1, //jb - we found a valid liscence for this child care cat - but it doesn't exist on the CCFRI form yet 
              ...item
            });
          }
        });
        
        if (!rootState.app.isRenewal || !state.CCFRIFacilityModel.prevYearFeesCorrect){ //only display previous year fees if it's the first time CCFRI application  -- OR fees are incorrect?
          response.data.forEach(item => {
            const prevProgramYear = getProgramYear(currProgramYear.previousYearId, programYearList);
            //check for undefined here! 

            let found = state.CCFRIFacilityModel.childCareTypes.find(searchItem => {
              return (searchItem.childCareCategoryId == item.childCareCategoryId &&
              searchItem.programYearId == prevProgramYear.programYearId);
            });
            if (!found) {
              careTypes.push( {
                programYear: prevProgramYear.name,
                programYearId: prevProgramYear.programYearId,
                current: 1,
                ...item
              });
            }
            else{
              found.deleteMe = false; 
            }
          });
        }

        if (rootState.app.isRenewal  && state.CCFRIFacilityModel.prevYearFeesCorrect){ //hides the prev year cards if user goes back and changes "prev fees correct" from NO to YES
          response.data.forEach(item => {
            const prevProgramYear = getProgramYear(currProgramYear.previousYearId, programYearList);
            //check for undefined here! 

            let found = state.CCFRIFacilityModel.childCareTypes.find(searchItem => {
              return (searchItem.childCareCategoryId == item.childCareCategoryId &&
              searchItem.programYearId == prevProgramYear.programYearId);
            });
            if (found) {
              found.deleteMe = true;
            }
          });
        }
        
        //if childcarecat GUID exists in childcaretypes but NOT in response - run delete
        //this handles the edge case of a user entering fees for CCFRI then going back to CCOF
        //and removing that child care type
        state.CCFRIFacilityModel.childCareTypes.forEach((childCareCat) => {
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
        commit('setLoadedModel', _.cloneDeep(state.CCFRIFacilityModel));
      } catch (e) {
        console.log('error', e);
      }
    },
  }
};

//
