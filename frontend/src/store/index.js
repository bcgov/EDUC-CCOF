import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth.js';
import app from './modules/app.js';
import organization from './modules/ccof/organization';
import licenseUpload from './modules/licenseUpload.js';
import supportingDocumentUpload from './modules/supportingDocumentUpload';
import funding from './modules/ccof/funding';
import facility from './modules/ccof/facility';

import ccfriApp from './modules/ccfriApp.js';
import application from './modules/application.js';
import navBar from './modules/navBar.js';

import rfiApp from './modules/rfiApp.js';
import nmfApp from './modules/nmfApp.js';
import eceweApp from './modules/eceweApp.js';
import message from './modules/message.js';
import summaryDeclaration from './modules/summaryDeclaration.js';

import reportChanges from './modules/reportChanges.js';
import document from './modules/document.js';

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
    navBar,
    reportChanges,
    document
  }
});
