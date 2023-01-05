import Vue from 'vue';
import Vuex from 'vuex';
import auth from '@/store/modules/auth.js';
import edx from '@/store/modules/edx.js';
import app from '@/store/modules/app.js';
import organization from '@/store/modules/ccof/organization';
import licenseUpload from '@/store/modules/licenseUpload.js';
import groupFunding from '@/store/modules/ccof/group/groupFundingStore';
import facility from '@/store/modules/ccof/group/facility.js';

import familyFunding from '@/store/modules/ccof/family/familyFundingStore';
import ccfriApp from '@/store/modules/ccfriApp.js';
import eceweApp from '@/store/modules/eceweApp.js';


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    edx,
    app,
    organization,
    facility,
    familyFunding,
    licenseUpload,
    groupFunding,
    ccfriApp,
    eceweApp,
  }
});
