import ApiService from '@/common/apiService';
import {ApiRoutes} from '@/utils/constants';
import {checkSession} from '@/utils/session';
//import { isChangeRequest } from '@/utils/common';

function parseLicenseCategories(licenseCategories, rootState) {
  const uniqueLicenseCategories = [...new Set(licenseCategories.map((item) => item.licenseCategoryId))];
  const lookupCategories = [...rootState.app.lookupInfo.familyLicenseCategory, ...rootState.app.lookupInfo.groupLicenseCategory];
  let categories = lookupCategories.filter(item => uniqueLicenseCategories.includes(item.ccof_license_categoryid)).map(a => a.ccof_name);
  return categories ? categories.toString() : '';
}

function getProgramYear(selectedGuid, programYearList){
  const programYear = programYearList.find(({ programYearId }) =>  programYearId == selectedGuid );

  if(!programYear){
    ///console.log('SELECTED PROGRAM YEAR GUID NOT FOUND :( ');
    throw 'SELECTED PROGRAM YEAR GUID NOT FOUND ';
  }

  return programYear;
}
export default {
  namespaced: true,
  state: {
    isValidForm: undefined,
    model: {},
    summaryModel: {},
    isSummaryLoading: [],
    isMainLoading: true,
    isLoadingComplete: false,
  },
  getters: {
    isCCFRIComplete: (state) => {
      return state.summaryModel?.facilities?.length > 0 ? state.summaryModel?.facilities.every(facility =>
        facility.ccfri?.ccof_formcomplete && (facility.ccfri?.ccfriOptInStatus === 1 || facility.ccfri?.ccfriOptInStatus === 0)
        && ((facility.ccfri?.unlockRfi === 1 || facility.ccfri?.hasRfi) ? facility.ccfri?.isRfiComplete : true)
        && ((facility.ccfri?.unlockNmf === 1 || facility.ccfri?.hasNmf) ? facility.ccfri?.isNmfComplete : true)) : false;
    },
    isECEWEComplete: (state) => {
      return state.summaryModel?.application?.isEceweComplete
        && state.summaryModel?.facilities?.length > 0 ? state.summaryModel?.facilities.every(facility => (facility.ecewe?.optInOrOut === 1 || facility.ecewe?.optInOrOut === 0)) : false;
    },
    isFacilityComplete: (state) => {
      return state.summaryModel?.facilities?.length > 0 ? state.summaryModel?.facilities.every(facility => (facility.facilityInfo?.isFacilityComplete == true)) : false;
    },
    areCheckBoxesComplete: (state, getters) => {
      let isComplete = (state.summaryModel?.application?.isEceweComplete
        && state.summaryModel?.application?.isLicenseUploadComplete
        && getters.isCCFRIComplete);
      return isComplete;
    },
  },
  mutations: {
    model(state, value) {
      state.model = value;
    },
    summaryModel(state, value) {
      state.summaryModel = value;
    },
    isSummaryLoading(state, value) {
      state.isSummaryLoading = value;
    },
    isMainLoading(state, value) {
      state.isMainLoading = value;
    },
    isValidForm(state, value) {
      state.isValidForm = value;
    },
    isLoadingComplete(state, value) {
      state.isLoadingComplete = value;
    }
  },
  actions: {
    async loadDeclaration({ commit, rootState }) {
      checkSession();
      try {
        let payload = (await ApiService.apiAxios.get(ApiRoutes.APPLICATION_DECLARATION + '/' + rootState.application.applicationId)).data;
        commit('model', payload);
      } catch (error) {
        console.log(`Failed to get Declaration - ${error}`);
        throw error;
      }
    },
    async loadChangeRequestDeclaration({ commit,} , changeRequestId) {
      checkSession();
      try {
        let payload = (await ApiService.apiAxios.get(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId)).data;

        //clear the old decleration data out so provider can sign again for Dec B
        if (payload.unlockDeclaration){
          payload.agreeConsentCertify = null;
          payload.orgContactName = null;
        }
        commit('model', payload);
      } catch (error) {
        console.log(`Failed to get Declaration - ${error}`);
        throw error;
      }
    },
    async updateDeclaration({ commit, state, rootState}, {changeRequestId, reLockPayload}) {
      checkSession();
      let payload = {
        agreeConsentCertify:state.model.agreeConsentCertify,
        orgContactName:state.model.orgContactName,
        declarationAStatus:state.model?.declarationAStatus,
        declarationBStatus:state.model?.declarationBStatus };
      try {
        if ((Object.keys(reLockPayload).length > 0)) {
          payload = {...payload, ...reLockPayload};
        }

        if (changeRequestId){
          //technically submit should be disabled until both these are filled in, so maybe don't need this?
          if (state.model.agreeConsentCertify && state.model.orgContactName){
            payload.externalStatus = 2;
          }

          let response = await ApiService.apiAxios.patch(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId, payload);
          state.model.externalStatus = 'SUBMITTED';
          commit('model', state.model);
          return response;
        }
        else{
          //PCF application submit
          let response = await ApiService.apiAxios.patch(ApiRoutes.APPLICATION_DECLARATION_SUBMIT + '/' + rootState.application.applicationId, payload);
          commit('application/setApplicationStatus', 'SUBMITTED', { root: true });
          commit('auth/setIsUserInfoLoaded', false, { root: true });
          return response;
        }
      } catch (error) {
        console.log(`Failed to SUBMIT application - ${error}`);
        throw error;
      }
    },
    async loadSummary({ commit, rootState }, changeRecGuid = undefined) {
      checkSession();
      try {
        commit('isMainLoading', true);
        let payload = (await ApiService.apiAxios.get(ApiRoutes.APPLICATION_SUMMARY + '/' + rootState.application.applicationId)).data;
        let summaryModel = {
          organization: undefined,
          application: payload.application,
          facilities: payload.facilities,
          ecewe:undefined
        };
        // filter out all facilities that are part of the change request --- Rob made the below code, when I pulled it in, it broke mine so commenting out for now
        // const changeRequestList = rootState.app.navBarList.map( el => { if (el.changeRequestId) return el.facilityId;}).filter(el => el);
        // console.log('change request List: ', changeRequestList);

        // summaryModel.facilities = summaryModel.facilities?.filter(el => !changeRequestList.includes(el.facilityId));

        //filter all facilites and only show the new ones associated with the changeRecGuid on the page
        if (changeRecGuid){
          summaryModel.facilities = summaryModel.facilities.filter(fac => {return fac.changeRequestId == changeRecGuid;});
        }
        else {
          summaryModel.facilities = summaryModel.facilities.filter(fac => {return !fac.changeRequestId;});
        }

        commit('summaryModel', summaryModel);
        commit('isMainLoading', false);


        let isSummaryLoading = new Array (summaryModel.facilities.length).fill(true);

        await commit('isSummaryLoading', isSummaryLoading );

        //new app only?
        if (!rootState.app.isRenewal && payload.application?.organizationId) {
          summaryModel.organization = (await ApiService.apiAxios.get(ApiRoutes.ORGANIZATION + '/' + payload.application.organizationId)).data;
          commit('summaryModel', summaryModel);
          summaryModel.ecewe = (await ApiService.apiAxios.get('/api/application/ecewe/' + payload.application.applicationId)).data;
          commit('summaryModel', summaryModel);
        }
        //new app only (i think this if block could be part of the one above?)
        if (payload.application?.organizationId) {
          const config={
            params: {
              allFiles: true
            }
          };
          summaryModel['allDocuments'] = (await ApiService.apiAxios.get(ApiRoutes.SUPPORTING_DOCUMENT_UPLOAD + '/' + payload.application.applicationId, config)).data;
          console.info('allDocuments', summaryModel['allDocuments'].length);
        }


        for (const facility of summaryModel.facilities) {
          const index = summaryModel.facilities.indexOf(facility);
          commit('summaryModel', summaryModel);
          let facilityLicenseResponse = undefined;
          try {
            facilityLicenseResponse = (await ApiService.apiAxios.get(`${ApiRoutes.FACILITY}/${facility.facilityId}/licenseCategories`)).data;
            summaryModel.facilities[index].licenseCategories = parseLicenseCategories(facilityLicenseResponse, rootState);
          } catch(categoryError) {
            console.log('error, unable to get childcare category for provider: ', facility.facilityId );
          }

          //check for opt out - no need for more calls if opt-out
          if (facility.ccfri?.ccfriId && facility.ccfri?.ccfriOptInStatus == 1) {
            let ccfriResponse = (await ApiService.apiAxios.get(ApiRoutes.CCFRIFACILITY + '/' + facility.ccfri.ccfriId)).data;
            facility.ccfri.childCareLicenses = facilityLicenseResponse; //jb - so I can build the CCFRI section
            facility.ccfri.childCareTypes = ccfriResponse.childCareTypes;
            facility.ccfri.dates = ccfriResponse.dates;
            const  ccofProgramYearId = rootState.application.programYearId;
            const programYearList = rootState.app.programYearList.list;
            facility.ccfri.currentYear = getProgramYear(ccofProgramYearId, programYearList);
            facility.ccfri.prevYear = getProgramYear(summaryModel.facilities[index].ccfri.currentYear.previousYearId, programYearList);

            //jb
            //load up the previous ccfri app if it exists, so we can check that we are not missing any child care fee categories from the last year.
            if (facility.ccfri.previousCcfriId){

              facility.ccfri.prevYearCcfriApp = (await ApiService.apiAxios.get(ApiRoutes.CCFRIFACILITY + '/' + facility.ccfri.previousCcfriId)).data;
            }
            if (facility.ccfri?.hasRfi || facility.ccfri?.unlockRfi)

              summaryModel.facilities[index].rfiApp = (await ApiService.apiAxios.get(ApiRoutes.APPLICATION_RFI + '/' + facility.ccfri.ccfriId + '/rfi')).data;
            commit('summaryModel', summaryModel);
            if (facility.ccfri?.hasNmf || facility.ccfri?.unlockNmf)
              summaryModel.facilities[index].nmfApp = (await ApiService.apiAxios.get(ApiRoutes.APPLICATION_NMF + '/' + facility.ccfri.ccfriId + '/nmf')).data;
              //summaryModel.faciliities[index].isNMFLoading=false
            commit('summaryModel', summaryModel);
          }

          //jb changed below to work with renewel apps
          summaryModel.facilities[index].facilityInfo = (await ApiService.apiAxios.get(ApiRoutes.FACILITY + '/' + facility.facilityId)).data;
          commit('summaryModel', summaryModel);

          if (summaryModel.allDocuments && summaryModel.allDocuments.length > 0) {
            const allDocuments =summaryModel.allDocuments;
            summaryModel.facilities[index].documents = allDocuments.filter(document => document.ccof_facility === facility.facilityId);
            commit('summaryModel', summaryModel);
          }

          isSummaryLoading.splice(index, 1, false);
          await commit('isSummaryLoading', isSummaryLoading );
        } // end FOR loop

        summaryModel.allDocuments = null;
        await commit('isLoadingComplete', true );
      } catch (error) {
        console.log(`Failed to load Summary - ${error}`);
        throw error;
      }
    },

    // eslint-disable-next-line no-empty-pattern
    async updateApplicationStatus({}, applicationObj) {
      checkSession();
      try {
        await ApiService.apiAxios.put('/api/application/status/'  + applicationObj.applicationId, applicationObj);
      } catch (error) {
        console.log(`Failed to update application status - ${error}`);
        throw error;
      }

    }
  },

};
