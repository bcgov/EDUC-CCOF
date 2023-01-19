import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';

function getProgramYear(selectedGuid, programYearList){
  const programYear = programYearList.find(({ programYearId }) =>  programYearId == selectedGuid );

  if(!programYear){
    console.log('SELECTED PROGRAM YEAR GUID NOT FOUND :( ');
    throw 'SELECTED PROGRAM YEAR GUID NOT FOUND :( ';
  }

  return programYear;
}

function getPreviousCareType(currentRFI, careType, previousProgramYearId, getters) {
  if (currentRFI.prevYearFeesCorrect) {
    let previousRFI = getters.getCCFRIById(currentRFI.previousCcfriId);
    console.log('previous childcare type: ', previousRFI.childCareTypes);
    console.log('categoryId: ', careType.childCareCategoryId);
    console.log('previousProgramYearId: ', previousProgramYearId);
    
    return previousRFI.childCareTypes.find(item =>{ return (item.childCareCategoryId == careType.childCareCategoryId && item.programYearId == previousProgramYearId); });
  } else {
    return currentRFI.childCareTypes.find(item => { return (item.childCareCategoryId == careType.childCareCategoryId && item.programYearId == previousProgramYearId); });
  }
}

function isOver3Percent(currentFees, previousFees, percentValue) {
  let currentFeeFrequency = currentFees.feeFrequency == 'Monthly' ? 1 : currentFees.feeFrequency == 'Weekly' ? 4 : 21;
  let previousFeeFrequency = previousFees.feeFrequency == 'Monthly' ? 1 : previousFees.feeFrequency == 'Weekly' ? 4 : 21;
  if (previousFees.approvedFeeFeb == previousFees.approvedFeeMar) {
    if ((currentFees.approvedFeeJan * currentFeeFrequency) - (previousFees.approvedFeeMar * previousFeeFrequency) > percentValue ||
        (currentFees.approvedFeeFeb * currentFeeFrequency) - (previousFees.approvedFeeMar * previousFeeFrequency) > percentValue ||
        (currentFees.approvedFeeMar * currentFeeFrequency) - (previousFees.approvedFeeMar * previousFeeFrequency) > percentValue) {
      console.log('Found RFI median condition for: previousFees.approvedFeeFeb == previousFees.approvedFeeMar');
      return true;
    }
  } else if ((previousFees.approvedFeeFeb > previousFees.approvedFeeMar) && (previousFees.approvedFeeFeb == previousFees.approvedFeeJan)) {
    if ((currentFees.approvedFeeJan * currentFeeFrequency) - (previousFees.approvedFeeFeb * previousFeeFrequency) > percentValue ||
        (currentFees.approvedFeeFeb * currentFeeFrequency) - (previousFees.approvedFeeFeb * previousFeeFrequency) > percentValue ||
        (currentFees.approvedFeeMar * currentFeeFrequency) - (previousFees.approvedFeeFeb * previousFeeFrequency) > percentValue) {
      console.log('Found RFI median condition for: previousFees.approvedFeeFeb > previousFees.approvedFeeMar');
      return true;
    }
  } else if (previousFees.approvedFeeFeb < previousFees.approvedFeeMar) {
    if ((currentFees.approvedFeeJan * currentFeeFrequency) - (previousFees.approvedFeeMar * previousFeeFrequency) > percentValue ||
        (currentFees.approvedFeeFeb * currentFeeFrequency) - (previousFees.approvedFeeMar * previousFeeFrequency) > percentValue ||
        (currentFees.approvedFeeMar * currentFeeFrequency) - (previousFees.approvedFeeMar * previousFeeFrequency) > percentValue) {
      console.log('Found RFI median condition for: previousFees.approvedFeeFeb < previousFees.approvedFeeMar');          
      return true;
    }
  }
  return false;
}


// function compareChildCareFees(currentFees, previousFees) {
//   let currentFeeFrequency = currentFees.feeFrequency == 'Monthly' ? 1 : currentFees.feeFrequency == 'Weekly' ? 4 : 20;
//   let previousFeeFrequency = previousFees.feeFrequency == 'Monthly' ? 1 : previousFees.feeFrequency == 'Weekly' ? 4 : 20;
//   console.log('currentFeeFrequency', currentFeeFrequency);
//   console.log('previousFeeFrequency', previousFeeFrequency);
//   let currentSum = 0;
//   currentSum += currentFees.approvedFeeJan * currentFeeFrequency;
//   currentSum += currentFees.approvedFeeFeb * currentFeeFrequency;
//   currentSum += currentFees.approvedFeeMar * currentFeeFrequency;
//   currentSum += currentFees.approvedFeeApr * currentFeeFrequency;
//   currentSum += currentFees.approvedFeeMay * currentFeeFrequency;
//   currentSum += currentFees.approvedFeeJun * currentFeeFrequency;
//   currentSum += currentFees.approvedFeeJul * currentFeeFrequency;
//   currentSum += currentFees.approvedFeeAug * currentFeeFrequency;
//   currentSum += currentFees.approvedFeeSep * currentFeeFrequency;
//   currentSum += currentFees.approvedFeeOct * currentFeeFrequency;
//   currentSum += currentFees.approvedFeeNov * currentFeeFrequency;
//   currentSum += currentFees.approvedFeeDec * currentFeeFrequency;
//   console.log(`currentSum for [${currentFees.childCareCategory}] is: [${currentSum}]`);
//   let previousSum = 0;
//   previousSum += previousFees.approvedFeeJan * previousFeeFrequency;
//   previousSum += previousFees.approvedFeeFeb * previousFeeFrequency;
//   previousSum += previousFees.approvedFeeMar * previousFeeFrequency;
//   previousSum += previousFees.approvedFeeApr * previousFeeFrequency;
//   previousSum += previousFees.approvedFeeMay * previousFeeFrequency;
//   previousSum += previousFees.approvedFeeJun * previousFeeFrequency;
//   previousSum += previousFees.approvedFeeJul * previousFeeFrequency;
//   previousSum += previousFees.approvedFeeAug * previousFeeFrequency;
//   previousSum += previousFees.approvedFeeSep * previousFeeFrequency;
//   previousSum += previousFees.approvedFeeOct * previousFeeFrequency;
//   previousSum += previousFees.approvedFeeNov * previousFeeFrequency;
//   previousSum += previousFees.approvedFeeDec * previousFeeFrequency;
//   console.log(`previousSum for [${previousFees.childCareCategory}] is: [${previousSum}]`);
//   return (currentSum - previousSum) / 12;
// }

export default {
  namespaced: true,
  state: {
    isValidForm: undefined,
    loadedModel: {},
    CCFRIFacilityModel : {},
    ccfriId: {},
    ccfriStore :{},
    ccfriMedianStore: {},
  },
  getters: {
    getCCFRIById: (state) => (ccfriId) => { 
      return state.ccfriStore[ccfriId];
    },
    getClosureDateLength: (state) => {
      return state.CCFRIFacilityModel.dates.length;
    },
    getCCFRIMedianById: (state) => (ccfriId) => { 
      return state.ccfriMedianStore[ccfriId];
    },
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
    addCCFRIMedianToStore: (state, {ccfriId, ccfriMedian} ) => {
      state.ccfriMedianStore[ccfriId] = ccfriMedian;  
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
    async getCcfriOver3percent({state, getters, rootState}) {
      console.log('getCcfriOver3percent.currentRFI: ', state.CCFRIFacilityModel);
      let over3percentFacilities = [];
      const currentProgramYearId = rootState.application.programYearId;
      const programYearList = rootState.app.programYearList.list;
      const currentProgramYear = getProgramYear(currentProgramYearId, programYearList);
      const previousProgramYear = getProgramYear(currentProgramYear.previousYearId, programYearList);
      const previousProgramYearId = previousProgramYear.programYearId;
      console.log('getCcfriOver3percent.currentRFI: ', state.CCFRIFacilityModel);
      const threePercentMedian = getters.getCCFRIMedianById(state.ccfriId);
      state.CCFRIFacilityModel.childCareTypes.filter( filterItem => filterItem.programYearId == currentProgramYearId)
        .forEach(careType => {
          console.log(`Determining RFI for : [${careType.childCareCategory}] using Current Year: [${currentProgramYear.name}] and Last Year [${previousProgramYear.name}]`);
          let previousCareType = getPreviousCareType(state.CCFRIFacilityModel, careType, previousProgramYearId, getters);
          if (previousCareType) {
            console.log('previousCare Type found, testing RFI median fees: ', previousCareType);
            // let difference = compareChildCareFees(careType, previousCareType);
            let allowedDifference = threePercentMedian[careType.childCareCategory];
            // console.log('difference', difference);
            if (allowedDifference) {
              console.log(`Testing RFI median difference using [${allowedDifference}] for [${careType.childCareCategory}]`);
              if (isOver3Percent(careType, previousCareType, allowedDifference)) {
                over3percentFacilities.push(careType.childCareCategory);
              }
            } else {
              console.log(`Skipping RFI median testing for [${careType.childCareCategory}], no RFI Meidan found.`);
            }
          } else {
            console.log('No previous careType found, skipping ');
          }
        });
      console.log('over array', over3percentFacilities);
      return over3percentFacilities;   
    },

    async loadCCFisCCRIMedian({state, getters, commit}) {
      let ccfriMedian = getters.getCCFRIMedianById(state.ccfriId); 
      if (!ccfriMedian) {
        checkSession();
        try {
          let response = await ApiService.apiAxios.get(`${ApiRoutes.APPLICATION_RFI}/${state.ccfriId}/median`);
          commit('addCCFRIMedianToStore', {ccfriId: state.ccfriId, ccfriMedian: response.data});                       
        } catch(e) {
          console.log(`Failed to get CCFRI Median - ${e}`);
          throw e;
        }
      }
    },
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
      const  ccofProgramYearId = rootState.application.programYearId;
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

        //if the user manually refreshes AddNewFees page - assume that previous years fees are correct. (same as hitting yes on Existing Fees Page)
        //may take this out later - rlo commented this out
        // if (state.CCFRIFacilityModel.prevYearFeesCorrect === undefined){
        //   state.CCFRIFacilityModel.prevYearFeesCorrect = true;
        // }
        
        if (!rootState.app.isRenewal || !state.CCFRIFacilityModel.prevYearFeesCorrect){ //only display previous year fees if it's the first time CCFRI application  -- OR prev fees are incorrect
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
