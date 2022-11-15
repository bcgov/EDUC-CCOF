import Vue from 'vue';
import Vuex from 'vuex';
import auth from '@/store/modules/auth.js';
import edx from '@/store/modules/edx.js';
import app from '@/store/modules/app.js';
import organization from '@/store/modules/organization.js';
import facility from '@/store/modules/facility.js';
import familyFunding from '@/store/modules/ccof/family/familyFundingStore';
import familyEligibility from '@/store/modules/ccof/family/familyEligibilityStore';
import familyOrganization from '@/store/modules/ccof/family/familyOrganizationStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    edx,
    app,
    organization,
    facility,
    familyFunding,
    familyEligibility,
    familyOrganization
  }
});
