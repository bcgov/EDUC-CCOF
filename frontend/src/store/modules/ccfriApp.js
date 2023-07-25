import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';
import { deepCloneObject } from '../../utils/common';

function isLocked(applicationStatus, navBarList, facilityId){

  console.log(facilityId, 'faccccc');
  let currentFac = navBarList.find((element) =>{
    return element.facilityId == facilityId;
  });

  console.log('currentFAC in store', currentFac);
  //if submitted, lock er up. If unlock CCFRI - unlock
  if (currentFac.unlockCcfri){
    return false;
  }
  else if (applicationStatus === 'SUBMITTED'){
    return true;
  }
  return false;

}
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
      return state.CCFRIFacilityModel?.dates?.length;
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
      console.log('add store called');
      console.log(CCFRIFacilityModel);
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
    /* eslint-disable no-empty-pattern */
    async getPreviousCCFRI({}, ccfriId) {
      try {
        const response = await ApiService.apiAxios.get(`${ApiRoutes.CCFRIFACILITY}/${ccfriId}`);
        return response.data.previousCcfriId;
      } catch(e) {
        console.log(`Failed to get existing Facility with error - ${e}`);
        throw e;
      }
    },
    async loadCCFRIFacility({getters, commit, dispatch}, ccfriId) {
      commit('setCcfriId', ccfriId);
      let CCFRIFacilityModel = getters.getCCFRIById(ccfriId);
      console.log('what is loaded in loadFac', CCFRIFacilityModel);
      let q = await dispatch('getPreviousCCFRI' ,ccfriId);
      //console.log('q', q);
      //let oldApp = await dispatch('getPreviousCCFRI' , ccfriId);

      if (CCFRIFacilityModel) {
        commit('setCCFRIFacilityModel', CCFRIFacilityModel);
        commit('setLoadedModel', deepCloneObject(CCFRIFacilityModel)); //copy the data from the ccfri facility model into a new object - otherwsie loadedModel will change also when user modifes the page
      } else {
        if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
          console.log('unable to load facility because you are not logged in');
          throw 'unable to  load facility because you are not logged in';
        }
        try {
          console.log('loading the ccfri');
          let response = await ApiService.apiAxios.get(`${ApiRoutes.CCFRIFACILITY}/${ccfriId}`);
          console.log('the resp', response);
          //response.data.previousCcfriId = await dispatch('getPreviousCCFRI' ,ccfriId);
          commit('addCCFRIToStore', {ccfriId: ccfriId, CCFRIFacilityModel: response.data});

          if(response.data.previousCcfriId){
            let oldCcfri = await ApiService.apiAxios.get(`${ApiRoutes.CCFRIFACILITY}/${response.data.previousCcfriId}`);
            commit('addCCFRIToStore', {ccfriId: response.data.previousCcfriId, CCFRIFacilityModel: oldCcfri.data});
          }
          commit('setCCFRIFacilityModel', response.data);
          commit('setLoadedModel', deepCloneObject(response.data));

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
        const prevProgramYear = getProgramYear(currProgramYear.previousYearId, programYearList);
        const prevCcfriApp = await state.ccfriStore[state.CCFRIFacilityModel.previousCcfriId];

        console.log(prevCcfriApp, 'in upper try');

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

        //display ALL previous year fee cards if it's the first time CCFRI application OR prev fees are incorrect OR if prev CCFRI is not found
        //JB - changed the logic to not show all years cards if the application is locked. This should hopefully solve a bug where a locked application was incorrectly loading previous year fees.
        if (!rootState.app.isRenewal || rootState.navBar.isChangeRequest || state.CCFRIFacilityModel.existingFeesCorrect != 100000000 || (!prevCcfriApp && !isLocked(rootState.application.applicationStatus, rootState.navBar.navBarList, state.loadedModel.facilityId)) ){
          console.log(rootState.app.isRenewal);
          console.log(state.CCFRIFacilityModel.existingFeesCorrect);
          console.log(prevCcfriApp);

          console.log('show all the cards');
          response.data.forEach(item => {

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

        /*
          first check if we are missing fee cards from last year. This can happen when a user has a new license for this year.
          Then check if we have any cards that don't belong (for example user selects NO fees are not correct, then goes back and selects YES)
        */
        else if (rootState.app.isRenewal && state.CCFRIFacilityModel.existingFeesCorrect == 100000000 && prevCcfriApp){
          console.log('prevCCFRI IS:' , prevCcfriApp);
          response.data.forEach(item => {

            //check to see if childcarecat exists in last years CCFRI app.
            let pastChildCareTypefound = prevCcfriApp.childCareTypes.find(prevChildCareCat => {
              return (prevChildCareCat.childCareCategoryId == item.childCareCategoryId &&
                prevChildCareCat.programYearId == prevProgramYear.programYearId );
            });

            //check to see if we have saved data for this child care cat in the list
            let foundChildCareCat = state.CCFRIFacilityModel.childCareTypes.find(searchItem => {
              return (searchItem.childCareCategoryId == item.childCareCategoryId &&
              searchItem.programYearId == prevProgramYear.programYearId );
            });

            //if child care type in last years CCFRI fees not found, but license  add a card for that child care cat previous years fees
            //this ensures we get 24 months of fees for a child care type that is new to the facility.
            if (!pastChildCareTypefound && !foundChildCareCat) {
              console.log('NOT FOUND!');
              careTypes.push( {
                programYear: prevProgramYear.name,
                programYearId: prevProgramYear.programYearId,
                childCareCategory: item.childCareCategory,
                childCareCategoryId: item.childCareCategoryId,
                orderNumber : item.orderNumber
              });
            }

            //not an else because (!pastChildCareTypefound && foundChildCareCat) is a possible event
            else if (pastChildCareTypefound && foundChildCareCat){
              console.log('adding delete flag for: ' , foundChildCareCat);
              //past child care type with fees found AND our users choice marked prev fees as correct... delete the card
              foundChildCareCat.deleteMe = true;
            }
          });
        }


        //if childcarecat GUID exists in childcaretypes but NOT in response - run delete
        //this handles the edge case of a user entering fees for CCFRI then going back to CCOF
        //and removing that child care type for new applications
        state.CCFRIFacilityModel.childCareTypes.forEach((childCareCat) => {
          let found = response.data.find(searchItem => {
            return (searchItem.childCareCategoryId == childCareCat.childCareCategoryId);
          });

          //Mark the child care type, and call the delete API with the parentFeeGUID
          if (!found) {
            console.log('no license for child care type' , childCareCat);
            childCareCat.deleteMe = true;
          }
        });




        state.CCFRIFacilityModel.childCareTypes.push(...careTypes);

        //sort them by age asc
        state.CCFRIFacilityModel.childCareTypes.sort((a, b) => a.orderNumber - b.orderNumber);

        //then sort by prev year first
        state.CCFRIFacilityModel.childCareTypes.sort((a, b) =>{
          const nameA = a.programYear.toUpperCase(); // ignore upper and lowercase
          const nameB = b.programYear.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });

        commit('setCCFRIFacilityModel', state.CCFRIFacilityModel);
        commit('setLoadedModel', deepCloneObject(state.CCFRIFacilityModel));
      } catch (e) {
        console.log('error', e);
      }
    },
  }
};
