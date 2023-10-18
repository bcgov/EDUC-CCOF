import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';
import { deepCloneObject } from '../../utils/common';
import { isEqual } from 'lodash';

function isLocked(applicationStatus, navBarList, facilityId){

  //console.log(facilityId, 'faccccc');
  let currentFac = navBarList.find((element) =>{
    return element.facilityId == facilityId;
  });

  //console.log('currentFAC in store', currentFac);
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

function getPreviousCareType(currentRFI, careType, previousProgramYearId, getters, rootState) {
  //console.log('CURRENTRFI', currentRFI);
  // Lookup previous years approved parent fees for most RFI scenarios
  if ((currentRFI.existingFeesCorrect == 100000000 && currentRFI.previousCcfriId) || (rootState.navBar.changeType == 'mtfi' && rootState.app.isRenewal ) ) {
    let previousRFI = getters.getPreviousApprovedFeesByFacilityId({facilityId: currentRFI.facilityId, previousProgramYearId: previousProgramYearId});
    return previousRFI.childCareTypes.find(item =>{ return (item.childCareCategoryId == careType.childCareCategoryId && item.programYearId == previousProgramYearId); });
  }
  //MTFI can be done on a new PCF or renewal - so it may not have previous CCFRI. If no previous CCFRI, base median off current year.
  //keep as elif because PCF RFI may call this but not satisfy the above if statement
  else if(rootState.navBar.changeType == 'mtfi' && !rootState.application.isRenewal ){
    return currentRFI.childCareTypes.find(item => { return (item.childCareCategoryId == careType.childCareCategoryId && item.programYearId == rootState.application.programYearId); });
  }
  //else - this will return undefined and RFI will be not be triggered
}

function isOver3Percent(currentFees, previousFees, percentValue) {
  let currentFeeFrequency = currentFees.feeFrequency == 'Monthly' ? 1 : currentFees.feeFrequency == 'Weekly' ? 4 : 21;
  let previousFeeFrequency = previousFees.feeFrequency == 'Monthly' ? 1 : previousFees.feeFrequency == 'Weekly' ? 4 : 21;
  console.log(`Current Fee Frequency: ${currentFeeFrequency}, Previous Fee Frequency: ${previousFeeFrequency}`);
  console.log(`Previous Fee Feb: ${previousFees.approvedFeeFeb}, Previous Fee March: ${previousFees.approvedFeeMar}`);
  console.log(`Current Fee Feb: ${currentFees.approvedFeeFeb}, Current Fee March: ${currentFees.approvedFeeMar}`);
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
  console.log('Fees not over 3% for ');
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
    previousFeeStore: {},
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
    getPreviousApprovedFeesByFacilityId: (state) => ({facilityId: facilityId, previousProgramYearId: programYearId}) => {
      return state.previousFeeStore[`${facilityId}-${programYearId}`];
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
    addPreviousApprovedParentFees: (state, {facilityId, programYearId, parentFeeModel} ) => {
      if (facilityId) {
        state.previousFeeStore[`${facilityId}-${programYearId}`] = parentFeeModel;
      }
    },
    removeCCFRIFromStore:(state, ccfriId ) => {
      if (ccfriId) {
        delete state.ccfriStore[ccfriId];
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
    async saveCcfri({state,} , {isFormComplete: isFormComplete, hasRfi: hasRfi}){
      //we should save the empty field to dynamics if user selects "no" on "Do you charge parent fees at this facility for any closures on business days
      if (state.CCFRIFacilityModel.hasClosureFees == 100000001){
        state.CCFRIFacilityModel.dates = [];
      }

      let payload = [];
      let firstObj = {
        ccfriApplicationGuid : state.ccfriId,
        facilityClosureDates : state.CCFRIFacilityModel.dates,
        ccof_formcomplete : isFormComplete,
        notes : state.CCFRIFacilityModel.ccfriApplicationNotes,
        ccof_has_rfi: hasRfi,
        hasClosureFees: state.CCFRIFacilityModel.hasClosureFees,
        existingFeesCorrect: state.CCFRIFacilityModel.existingFeesCorrect
      };
      if (this.isRenewal) {
        firstObj = {
          ...firstObj,
          ccof_has_rfi: hasRfi,
          existingFeesCorrect: state.CCFRIFacilityModel.existingFeesCorrect,
        };
      }

      //checks if blank - don't save empty rows
      for(let i =  state.CCFRIFacilityModel.dates.length -1; i >=0; i--){
        if (isEqual( state.CCFRIFacilityModel.dates[i], this.dateObj)){
          state.CCFRIFacilityModel.dates.splice(i, 1);
        }
      }

      //for each child care type - prepare an object for the payload
      //index will also match the order of how the cards are displayed.
      state.CCFRIFacilityModel.childCareTypes.forEach (async (item, index) => { //if any fee, dates, or notes have been inputted, run the save. else don't make the call
        if (item.feeFrequency) {

          payload[index] = {
            parentFeeGUID : item.parentFeeGUID,
            deleteMe: item.deleteMe,
            ccfriApplicationGuid : state.ccfriId, //CCFRI application GUID
            childCareCategory : item.childCareCategoryId,
            programYear : item.programYearId,
            aprFee : item.approvedFeeApr,
            mayFee : item.approvedFeeMay,
            junFee : item.approvedFeeJun,
            julFee : item.approvedFeeJul,
            augFee : item.approvedFeeAug,
            sepFee : item.approvedFeeSep,
            octFee : item.approvedFeeOct,
            novFee : item.approvedFeeNov,
            decFee : item.approvedFeeDec,
            janFee : item.approvedFeeJan,
            febFee : item.approvedFeeFeb,
            marFee : item.approvedFeeMar,
          };

          payload[index].feeFrequency = item.feeFrequency === 'Monthly'? '100000000' : item.feeFrequency  === 'Weekly'? '100000001' :item.feeFrequency === 'Daily'? '100000002' :'null';
        }

      }); // end FOR EACH

      let obj = Object.assign(firstObj, payload[0]);

      payload[0] = obj;

      try {
        let res = await ApiService.apiAxios.patch('/api/application/parentfee/', payload);
        return res;
      } catch (error) {
        console.log(error);
      }
    },
    async getCcfriOver3percent({state, getters, rootState}, currentCcfri = undefined) {
      //FOR MTFI ONLY
      //previous CCFRI == previous PCF ccfri
      //CURRENT ccfri == PCF current fiscal CCFRI
      //CCFRI Facility model == MTFI CCFRI
      let over3percentFacilities = [];
      const currentProgramYearId = rootState.application.programYearId;
      const programYearList = rootState.app.programYearList.list;
      const currentProgramYear = getProgramYear(currentProgramYearId, programYearList);
      const previousProgramYear = getProgramYear(currentProgramYear.previousYearId, programYearList);
      const previousProgramYearId = previousProgramYear.programYearId;
      //console.log('getCcfriOver3percent.currentRFI: ', state.CCFRIFacilityModel);
      const threePercentMedian = getters.getCCFRIMedianById(currentCcfri? currentCcfri.ccfriApplicationId : state.ccfriId);
      state.CCFRIFacilityModel.childCareTypes.filter( filterItem => filterItem.programYearId == currentProgramYearId)
        .forEach(careType => {
          console.log(`Determining RFI for : [${careType.childCareCategory}] using Current Year: [${currentProgramYear.name}] and Last Year [${previousProgramYear.name}]`);
          let previousCareType = getPreviousCareType((currentCcfri? currentCcfri : state.CCFRIFacilityModel), careType, previousProgramYearId, getters, rootState);
          //console.log('da previous care type', previousCareType);
          if (previousCareType) {
            console.log('previousCare Type found, testing RFI median fees: ', previousCareType);
            let allowedDifference = threePercentMedian ? threePercentMedian[careType.childCareCategory] : null;
            //console.log('difference', difference);
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
    async loadCCFisCCRIMedian({state, getters, commit}, ccfriToLoad) {
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
      else if (ccfriToLoad){
        try {
          let response = await ApiService.apiAxios.get(`${ApiRoutes.APPLICATION_RFI}/${ccfriToLoad}/median`);
          commit('addCCFRIMedianToStore', {ccfriId: ccfriToLoad, ccfriMedian: response.data});
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
    async loadCCFRIFacility({getters, commit}, ccfriId) {
      commit('setCcfriId', ccfriId);
      let CCFRIFacilityModel = getters.getCCFRIById(ccfriId);
      //console.log('what is loaded in loadFac', CCFRIFacilityModel);
      // await dispatch('getPreviousCCFRI' ,ccfriId);

      if (CCFRIFacilityModel) {
        commit('setCCFRIFacilityModel', CCFRIFacilityModel);
        commit('setLoadedModel', deepCloneObject(CCFRIFacilityModel)); //copy the data from the ccfri facility model into a new object - otherwsie loadedModel will change also when user modifes the page
      } else {
        if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
          console.log('unable to load facility because you are not logged in');
          throw 'unable to  load facility because you are not logged in';
        }
        try {
          let response = await ApiService.apiAxios.get(`${ApiRoutes.CCFRIFACILITY}/${ccfriId}`);
          commit('addCCFRIToStore', {ccfriId: ccfriId, CCFRIFacilityModel: response.data});
          // if(response.data.previousCcfriId){
          //   let oldCcfri = await ApiService.apiAxios.get(`${ApiRoutes.CCFRIFACILITY}/${response.data.previousCcfriId}`);
          //   commit('addCCFRIToStore', {ccfriId: response.data.previousCcfriId, CCFRIFacilityModel: oldCcfri.data});
          // }
          commit('setCCFRIFacilityModel', response.data);
          commit('setLoadedModel', deepCloneObject(response.data));

        } catch(e) {
          console.log(`Failed to get existing Facility with error - ${e}`);
          throw e;
        }
      }
    },
    async getPreviousApprovedFees({commit, state}, {facilityId, programYearId}) {
      const prevFees = state.previousFeeStore[`${facilityId}-${programYearId}`];
      if (prevFees) {
        return prevFees;
      } else {
        try {
          const response = await ApiService.apiAxios.get(`${ApiRoutes.CCFRI_FEES}/${facilityId}/year/${programYearId}`);
          commit('addPreviousApprovedParentFees', {facilityId: facilityId, programYearId: programYearId, parentFeeModel: response.data});
          return response.data;
        } catch(e) {
          console.log(`Failed to get existing Facility with error - ${e}`);
          throw e;
        }
      }
    },
    async decorateWithCareTypes({commit, dispatch, state, rootState}, facilityId) {
      const  ccofProgramYearId = rootState.application.programYearId;
      const programYearList = rootState.app.programYearList.list;

      try {
        let response = await ApiService.apiAxios.get(`${ApiRoutes.FACILITY}/${facilityId}/licenseCategories`);
        console.log('resp', response);
        let careTypes = [];
        const currProgramYear = getProgramYear(ccofProgramYearId, programYearList);
        const prevProgramYear = getProgramYear(currProgramYear.previousYearId, programYearList);
        const prevCcfriApp = await dispatch('getPreviousApprovedFees', {facilityId: facilityId, programYearId: prevProgramYear.programYearId});

        console.log(prevCcfriApp, 'in upper try');

        //('currProgramYear', currProgramYear);

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
        if ((rootState.navBar.changeType != 'mtfi') && ( !rootState.application.isRenewal || rootState.navBar.isChangeRequest || state.CCFRIFacilityModel.existingFeesCorrect != 100000000 || (!prevCcfriApp && !isLocked(rootState.application.applicationStatus, rootState.navBar.navBarList, state.loadedModel.facilityId)) )){
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
        if (rootState.application.isRenewal && state.CCFRIFacilityModel.existingFeesCorrect == 100000000 && prevCcfriApp){
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
