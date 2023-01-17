import Vue from 'vue';
import Vuex from 'vuex';
import auth from '@/store/modules/auth.js';
import app from '@/store/modules/app.js';
import organization from '@/store/modules/ccof/organization';
import licenseUpload from '@/store/modules/licenseUpload.js';
import supportingDocumentUpload from '@/store/modules/supportingDocumentUpload';
import funding from '@/store/modules/ccof/funding';
import facility from '@/store/modules/ccof/facility';

import ccfriApp from '@/store/modules/ccfriApp.js';
import application from '@/store/modules/application.js';
import navBar from '@/store/modules/navBar.js';

import rfiApp from '@/store/modules/rfiApp.js';
import nmfApp from '@/store/modules/nmfApp.js';
import eceweApp from '@/store/modules/eceweApp.js';
import message from '@/store/modules/message.js';
import summaryDeclaration from '@/store/modules/summaryDeclaration.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    app,
    application,
    organization,
    facility,
    licenseUpload,
    funding,
    ccfriApp,
    eceweApp,
    rfiApp,
    nmfApp,
    message,
    supportingDocumentUpload,
    summaryDeclaration,
    navBar
  }
});
