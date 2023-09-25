import ApiService from '@/common/apiService';
import {ApiRoutes} from '@/utils/constants';
import {checkSession} from '@/utils/session';
import { CHANGE_REQUEST_TYPES } from '@/utils/constants';

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
        if (payload && rootState.application.unlockDeclaration) {
          payload.agreeConsentCertify = null;
          payload.orgContactName = null;
        }
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
    async updateDeclaration({ commit, state, rootState, dispatch}, {changeRequestId, reLockPayload}) {
      checkSession();
      let payload = {
        agreeConsentCertify:state.model.agreeConsentCertify,
        orgContactName:state.model.orgContactName,
        declarationAStatus:state.model?.declarationAStatus,
        declarationBStatus:state.model?.declarationBStatus,
        summaryDeclarationApplicationName: state.summaryModel?.application?.name};
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
          dispatch('reportChanges/updateExternalStatusInChangeRequestStore', {changeRequestId: changeRequestId, newStatus: 2}, { root: true });
          dispatch('reportChanges/updateExternalStatusInChangeRequestMap', {changeRequestId: changeRequestId, newStatus: 'SUBMITTED'}, { root: true });
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

        summaryModel.facilities = summaryModel.facilities?.filter(fac => {
          return rootState.navBar.navBarList?.findIndex(item => item.facilityId === fac.facilityId) > -1;
        });

        commit('summaryModel', summaryModel);
        commit('isMainLoading', false);


        let isSummaryLoading = new Array (summaryModel.facilities.length).fill(true);

        await commit('isSummaryLoading', isSummaryLoading );

        //new app only?
        if (!rootState.application.isRenewal && payload.application?.organizationId) {
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
        if (!changeRecGuid)
          commit('isLoadingComplete', true );
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
    },

    async loadChangeRequestSummaryDeclaration({ state, commit, dispatch }, changeRequestId) {
      checkSession();
      try {
        commit('isLoadingComplete', false);
        if (!state.summaryModel)
          commit('isMainLoading', true);
        let payload = (await ApiService.apiAxios.get(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId))?.data;
        let changeRequestTypes = [];
        payload?.changeActions?.forEach(item => {
          if (!changeRequestTypes.includes(item.changeType)) {
            changeRequestTypes.push(item.changeType)
          };
        });

        // Load Declaration model
        let declarationModel = {
          unlockDeclaration: payload?.unlockDeclaration,
          agreeConsentCertify: payload?.unlockDeclaration ? null : payload?.agreeConsentCertify,
          orgContactName: payload?.unlockDeclaration ? null : payload?.orgContactName,
          externalStatus: payload?.externalStatus,
          enabledDeclarationB: payload?.enabledDeclarationB,
          declarationAStatus: payload?.declarationAStatus,
          declarationBStatus: payload?.declarationBStatus
        }
        commit('model', declarationModel);

        // Load Summary model
        let summaryModel = {
          ...state.summaryModel,
          changeActions: payload?.changeActions,
          changeRequestTypes: changeRequestTypes,
        };
        commit('summaryModel', summaryModel);
        await Promise.all(changeRequestTypes.map(async changeType => {
          switch (changeType) {
            case CHANGE_REQUEST_TYPES.NEW_FACILITY:
              await dispatch('loadChangeRequestSummaryForAddNewFacility', payload);
              break;
            case CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE:
              await dispatch('loadChangeRequestSummaryForMtfi', payload);
              break;
            case CHANGE_REQUEST_TYPES.PDF_CHANGE:
              await dispatch('loadChangeRequestSummaryForChangeNotiForm', payload);
              break;
            default:
              throw `Not found change request type - ${changeType}`;
            }
        }))
        commit('isLoadingComplete', true );
      } catch (error) {
        console.log(`Failed to load Summary and Declaration for Change Request - ${error}`);
        throw error;
      }
    },

    async loadChangeRequestSummaryForAddNewFacility({ state, commit }, payload) {
      try {
        let summaryModel = state.summaryModel;
        let changeRequestECEWE = {
          optInECEWE: payload?.optInECEWE,
          belongsToUnion: payload?.belongsToUnion,
          applicableSector: payload?.applicableSector,
          fundingModel: payload?.fundingModel,
          confirmation: payload?.confirmation,
        };
        summaryModel.ecewe = changeRequestECEWE;
        commit('summaryModel', summaryModel);
      } catch (error) {
        console.log(`Failed to load Summary for change request Add New Facility - ${error}`);
        throw error;
      }
    },

    // Assumption: a change request can only have 1 MTFI change action
    async loadChangeRequestSummaryForMtfi({ state, commit, rootState }, payload) {
      try {
        let summaryModel = state.summaryModel;
        let mtfiChangeAction = payload.changeActions?.find(item => item.changeType === CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE);
        summaryModel.mtfiFacilities = mtfiChangeAction?.mtfi;

        let isSummaryLoading = new Array (summaryModel.mtfiFacilities.length).fill(true);
        commit('isSummaryLoading', isSummaryLoading);

        await Promise.all(summaryModel.mtfiFacilities.map(async (mtfiFacility, index) => {
          let userProfileListFacility = rootState.navBar.userProfileList.find(item => item.facilityId === mtfiFacility.facilityId);
          if (userProfileListFacility) {
            mtfiFacility.facilityName = userProfileListFacility.facilityName;
            mtfiFacility.facilityAccountNumber = userProfileListFacility.facilityAccountNumber;
            mtfiFacility.licenseNumber = userProfileListFacility.licenseNumber;

            mtfiFacility.oldCcfriApplicationId = userProfileListFacility.ccfriApplicationId;
            mtfiFacility.oldCcfri = (await ApiService.apiAxios.get(`${ApiRoutes.CCFRIFACILITY}/${mtfiFacility.oldCcfriApplicationId}`)).data;
            mtfiFacility.oldCcfri.childCareTypes = mtfiFacility.oldCcfri?.childCareTypes?.filter(item => item.programYearId === rootState.application.programYearId);
            mtfiFacility.oldCcfri?.childCareTypes?.sort((a, b) => a.orderNumber - b.orderNumber);

            mtfiFacility.newCcfri = (await ApiService.apiAxios.get(`${ApiRoutes.CCFRIFACILITY}/${mtfiFacility.ccfriApplicationId}`)).data;
            mtfiFacility.newCcfri.childCareTypes = mtfiFacility.newCcfri?.childCareTypes?.filter(item => item.programYearId === rootState.application.programYearId);
            mtfiFacility.newCcfri?.childCareTypes?.sort((a, b) => a.orderNumber - b.orderNumber);

            if (mtfiFacility.hasRfi || mtfiFacility.unlockRfi)
              mtfiFacility.rfiApp = (await ApiService.apiAxios.get(`${ApiRoutes.APPLICATION_RFI}/${mtfiFacility.ccfriApplicationId}/rfi`)).data;
            isSummaryLoading.splice(index, 1, false);
            commit('isSummaryLoading', isSummaryLoading);
            if (state.isMainLoading)
              commit('isMainLoading', false);
          }
          commit('summaryModel', summaryModel);
        }));
      } catch (error) {
        console.log(`Failed to load Summary for change request MTFI - ${error}`);
        throw error;
      }
    },

    // Assumption: a change request can only have 1 Change Notification Form change action
    async loadChangeRequestSummaryForChangeNotiForm({ state, commit, dispatch }, payload) {
      try {
        let summaryModel = state.summaryModel;
        let changeNotiChangeAction = payload.changeActions?.find(item => item.changeType === CHANGE_REQUEST_TYPES.PDF_CHANGE);
        summaryModel.changeNotificationFormDocuments = await dispatch('reportChanges/loadChangeRequestDocs', changeNotiChangeAction?.changeActionId, { root: true });
        commit('summaryModel', summaryModel);
        commit('isMainLoading', false);
      } catch (error) {
        console.log(`Failed to load Summary for change request Change Notification Form - ${error}`);
        throw error;
      }
    },
  },

};
