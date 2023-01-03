import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

function getProgramYear(selectedGuid, programYearList){
  const programYear = programYearList.find(({ programYearId }) =>  programYearId == selectedGuid );

  if(!programYear){
    console.log('SELECTED PROGRAM YEAR GUID NOT FOUND :( ');
  }

  return programYear;
}


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
      const  ccofProgramYearId = rootState.auth.userInfo.ccofProgramYearId;
      const programYearList = rootState.app.programYearList.list;

      try {
        let response = await ApiService.apiAxios.get(`${ApiRoutes.FACILITY}/${facilityId}/licenseCategories`); 
        console.log('reponse is is: ', response); //?
        let careTypes = [];

        const currProgramYear = getProgramYear(ccofProgramYearId, programYearList);
        //maybe add error checking here? - undefined means we didn't find a valid program year 

        console.log('resp:', response);

        if (!state.CCFRIFacilityModel.prevYearFeesCorrect){ //if current year fees are correct (ExistingFacilityFees.vue -> Yes), don't display those cards to the user. First time CCFRI will always show this
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
        }

        if (rootState.app.isRenewal){ //if app is a renewal, we will always need the future year cards regardless if yes/no is answered on the ExistingFacilityFees page
          response.data.forEach(item => {
            let found = state.CCFRIFacilityModel.childCareTypes.find(searchItem => {
              return (searchItem.childCareCategoryId == item.childCareCategoryId &&
              searchItem.programYearId == rootState.app.programYearList.future.programYearId); //need a special function to find a future year
            });
            if (!found) {
              careTypes.push( {
                programYear: rootState.app.programYearList.future.name, //we need one more GUID into the future for this to work?
                programYearId: rootState.app.programYearList.future.programYearId,
                current: 1, //jb - we found a valid liscence for this child care cat - but it doesn't exist on the CCFRI form yet 
                ...item
              });
            }
          });
        }
        
        if (!rootState.app.isRenewal){ //only display previous year fees if it's the first time CCFRI application
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
          });
        }
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
