import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';



function getProgramYear(selectedGuid, programYearList){
  const programYear = programYearList.find(({ programYearId }) =>  programYearId == selectedGuid );

  if(!programYear){
    //console.log('SELECTED PROGRAM YEAR GUID NOT FOUND :( ');
    throw 'SELECTED PROGRAM YEAR GUID NOT FOUND ';
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
        console.log('resp', response);
        let careTypes = [];
        const currProgramYear = getProgramYear(ccofProgramYearId, programYearList);

        console.log('currProgramYear', currProgramYear);

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
        
        //only display previous year fees if it's the first time CCFRI application  -- OR prev fees are incorrect
        if (!rootState.app.isRenewal || !state.CCFRIFacilityModel.prevYearFeesCorrect){ 
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

        const isHistoricalYear = (currProgramYear.name === '2022/23 FY' || currProgramYear.name === '2021/22 FY' );
        console.log('historcal year?' , isHistoricalYear);
        //always show 24 months of fees for preschool and out of school care
        if (state.CCFRIFacilityModel.prevYearFeesCorrect && isHistoricalYear == false){ 
          const preschoolGuid = rootState.app.childCareCategoryList.find(({ ccof_name }) =>  ccof_name === 'PRE' ).ccof_childcare_categoryid;
          const grade1PlusGuid = rootState.app.childCareCategoryList.find(({ ccof_name }) =>  ccof_name === 'OOSC-G' ).ccof_childcare_categoryid;

          const prevProgramYear = getProgramYear(currProgramYear.previousYearId, programYearList);
          const prevCcfriApp = state.ccfriStore[state.CCFRIFacilityModel.previousCcfriId];
         
          response.data.forEach(item => {
            if (item.childCareCategoryId == preschoolGuid || item.childCareCategoryId == grade1PlusGuid){
              careTypes.push( {
                programYear: prevProgramYear.name,
                programYearId: prevProgramYear.programYearId,
                ...item
              });
            }
            //check if we are missing fees for any child care type from last year. If so, add a card for the missing year's fees.
            else if (prevCcfriApp.childCareTypes.length <  response.data.length){
              console.log('child care Cat are different lengths.');

              let found = prevCcfriApp.childCareTypes.find(prevChildCareCat => {
                return (prevChildCareCat.childCareCategoryId == item.childCareCategoryId);
              });
    
              //if match in last years CCFRI fees not found, add a card for that child care cat previous years fees
              if (!found) {
                console.log('NOT FOUND!');
                careTypes.push( {
                  programYear: prevProgramYear.name,
                  programYearId: prevProgramYear.programYearId,
                  childCareCategory: item.childCareCategory,
                  childCareCategoryId: item.childCareCategoryId
                });
              }
            }
          });

          // const prevCcfriApp = state.ccfriStore[state.CCFRIFacilityModel.previousCcfriId];

          // console.log('thePREVapp', prevCcfriApp);

          // if(prevCcfriApp.childCareTypes.length <  response.data.length){
          //   console.log(prevCcfriApp);
          //   //then we have a scenario where there is a brand new child care cat for this year. We need to find out which one and add the fees
          //   console.log('child care Cat are different lengths.');

          //   response.data.forEach((childCareCat) => {
          //     let found = prevCcfriApp.childCareTypes.find(prevChildCareCat => {
          //       console.log('prev', prevChildCareCat.childCareCategoryId);
          //       console.log('curr', response.data.childCareCategoryId);
          //       return (prevChildCareCat.childCareCategoryId == childCareCat.childCareCategoryId);
          //     });
    
          //     //if match in last years CCFRI fees not found, add a card for that child care cat previous years fees
          //     if (!found) {
          //       console.log('NOT FOUND!');
          //       careTypes.push( {
          //         programYear: prevProgramYear.name,
          //         programYearId: prevProgramYear.programYearId,
          //         childCareCategory: childCareCat.childCareCategory,
          //         childCareCategoryId: childCareCat.childCareCategoryId
          //       });
          //     }
          //   });
          // }
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
