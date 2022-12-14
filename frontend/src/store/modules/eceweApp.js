import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  namespaced: true,
  state: {
    q1OptInECEWE: null,
    q2BelongsToUnion: null,
    q3FundingModel: null,
    facilities: [],
    userDeclaration: null,
    isValidForm: false,
    isStarted: false
  },
  getters: {
    isEceweComplete: state => state.isValidForm,
  },  
  mutations: {
    setQ1OptInECEWE: (state, q1OptInECEWE) => { state.q1OptInECEWE = q1OptInECEWE; },
    setQ2BelongsToUnion: (state, q2BelongsToUnion) => { state.q2BelongsToUnion = q2BelongsToUnion; },
    setQ3FundingModel: (state, q3FundingModel) => { state.q3FundingModel = q3FundingModel; },
    setFacilities: (state, facilities) => { state.facilities = facilities; },
    setUserDeclaration: (state, userDeclaration) => { state.userDeclaration = userDeclaration; },
    setIsValidForm: (state, isValidForm) => { state.isValidForm = isValidForm; },
    setIsStarted: (state, isStarted) => { state.isStarted = isStarted; }
  },
  actions: {
    async loadECEWE({ commit, rootState }) {
      if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
        console.log('unable to load ECEWE Application because you are not logged in');
        throw 'unable to load ECEWE Application because you are not logged in';
      }
      try {
        console.log('about to call = '+ApiRoutes.APPLICATION_ECEWE + '/' + rootState.auth.userInfo.applicationId);
        let payload = (await ApiService.apiAxios.get('/api/application/ecewe/' + rootState.auth.userInfo.applicationId)).data;
        //TODO move initECEWEFacilities here.
        commitToState(commit, payload);
      } catch (error) {
        console.log(`Failed to get ECEWE Application - ${error}`);
        throw error;
      }
    },
    async saveECEWE({ state, rootState }) {
      if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
        console.log('unable to save because you are not logged in');
        throw 'unable to save ecewe application because you are not logged in';
      }
      let payload = JSON.parse(JSON.stringify(state));
      // has an application ID, so update the data
      try {
        // remove attributes we are not updating before sending payload.
        delete payload.facilities;
        let response = await ApiService.apiAxios.patch(ApiRoutes.APPLICATION_ECEWE + '/' + rootState.auth.userInfo.applicationId, payload);
        return response;
      } catch (error) {
        console.log(`Failed to update existing ECEWE application - ${error}`);
        throw error;
      }
    },
    async saveECEWEFacilities({ state, rootState }) {
      if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
        console.log('unable to save because you are not logged in');
        throw 'unable to save ecewe facility application because you are not logged in';
      }
      let facilitiesForBackend = state.facilities;
      facilitiesForBackend.forEach(object => {
        delete object['update'];
      });
      let payload = JSON.parse(JSON.stringify(facilitiesForBackend));
      // has an application ID, so update the data
      try {
        let response = await ApiService.apiAxios.post(ApiRoutes.APPLICATION_ECEWE_FACILITY + '/' + rootState.auth.userInfo.applicationId, payload);
        return response;
      } catch (error) {
        console.log(`Failed to update existing ECEWE facility application - ${error}`);
        throw error;
      }
    },
    /* Initalizes\creates the facilities payload depending on if ecewe facilities exist or not. */
    initECEWEFacilities({ state, rootState }, navBarList) {
      if (state.facilities?.length == 0 || state.facilities == null) {
        state.facilities = new Array(navBarList.length).fill({});
        for (let i = 0; i < navBarList.length; i++) {
          // TODO statuscode behavior confimration
          state.facilities[i] = {applicationid: rootState.auth.userInfo.applicationId, facilityId: navBarList[i].facilityId, optInOrOut: null, statuscode: 1};
        }
        state.facilities = state.facilities.map(obj => ({ ...obj, update: true }));
      } else {
        let tempFacilities = new Array(navBarList.length).fill({});
        for (let j = 0; j < navBarList.length; j++) {
          tempFacilities[j] = {facilityId: navBarList[j].facilityId,
            eceweApplicationId: getEceweApplicationId(navBarList[j].facilityId),
            optInOrOut: getOptInOrOut(navBarList[j].facilityId),
            statuscode: getStatuscode(navBarList[j].facilityId),
            update: getUpdate(navBarList[j].facilityId)};
        }
        state.facilities = tempFacilities;
      }
      function getEceweApplicationId(facilityId) {
        const index = state.facilities.map(facilty => facilty.facilityId).indexOf(facilityId);
        return (index >= 0)?state.facilities[index].eceweApplicationId:null;
      }
      
      function getOptInOrOut(facilityId) {
        const index = state.facilities.map(facilty => facilty.facilityId).indexOf(facilityId);
        return (index >= 0)?state.facilities[index].optInOrOut:null;
      }
      
      function getStatuscode(facilityId) {
        const index = state.facilities.map(facilty => facilty.facilityId).indexOf(facilityId);
        return (index >= 0)?state.facilities[index].statuscode:null;
      }
      
      function getUpdate(facilityId) {
        const index = state.facilities.map(facilty => facilty.facilityId).indexOf(facilityId);
        return (index >= 0)?(state.facilities[index].optInOrOut !=null?false:true):true;
      }
    }
  },
};

function commitToState(commit, data) {
  commit('setQ1OptInECEWE', String(data?.q1OptInECEWE));
  commit('setQ2BelongsToUnion', String(data?.q2BelongsToUnion));
  commit('setQ3FundingModel', String(data?.q3FundingModel));
  commit('setFacilities', data?.facilities);
  commit('setUserDeclaration', data?.userDeclaration);
}

