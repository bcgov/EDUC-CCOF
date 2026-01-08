import LicenseUpload from '@/components/ccofApplication/group/LicenseUpload.vue';
import vuetify from '@/plugins/vuetify';
import { APPLICATION_STATUSES, ApiRoutes } from '@/utils/constants.js';

const applicationId = '4321';
const programYearId = '1234';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(LicenseUpload, {
      global: {
        plugins: [pinia, vuetify],
      },
    });
  });
}

function interceptAPI() {
  cy.intercept('GET', `${ApiRoutes.LICENSE_UPLOAD}/${applicationId}`, {
    statusCode: 200,
    body: [
      {
        ccof_facility: '9999',
      },
    ],
  });
}

describe('<LicenseUpload />', () => {
  it('should render `change request in progress` message if change request is active', () => {
    interceptAPI();
    mountWithPinia({
      reportChanges: {
        changeRequestStore: [
          {
            externalStatus: 2,
            changeActions: [{ changeType: '' }],
          },
        ],
      },
      application: {
        applicationStatus: APPLICATION_STATUSES.SUBMITTED,
        programYearId,
        applicationMap: new Map([[programYearId, { applicationId }]]),
      },
    });

    cy.contains('.v-card-title', 'You have a change request in progress.');
    cy.contains('.v-card-text', 'We will complete the assessment of your Program Confirmation Form');
  });

  it('should render formatted program year if is renewal', () => {
    interceptAPI();
    mountWithPinia({
      application: {
        isRenewal: true,
        programYearLabel: 'TEST 2025XX',
        programYearId,
        applicationMap: new Map([[programYearId, { applicationId }]]),
      },
    });
    cy.contains('Licence Upload - 2025 Program Confirmation Form');
  });

  it('should render data table facility information', () => {
    const facilityName = 'TEST_FAC_NAME';
    const facilityAccountNumber = '589421';
    const licenseNumber = 'LIC-11111';

    interceptAPI();
    mountWithPinia({
      application: {
        isRenewal: true,
        programYearId,
        programYearLabel: 'TEST 2025XX',
        applicationMap: new Map([[programYearId, { applicationId }]]),
      },
      navBar: {
        navBarList: [{ facilityId: '9999', facilityName, facilityAccountNumber, licenseNumber }],
      },
    });
    cy.get('.v-data-table').within(() => {
      cy.contains(facilityName);
      cy.contains(facilityAccountNumber);
      cy.contains(licenseNumber);
    });
  });

  it('should render document filename and delete button', () => {
    const facilityName = 'TEST_FAC_NAME';
    const facilityAccountNumber = '589421';
    const licenseNumber = 'LIC-11111';
    const filename = 'TEST_FILE_NAME';

    cy.intercept('GET', `${ApiRoutes.LICENSE_UPLOAD}/${applicationId}`, {
      statusCode: 200,
      body: [
        {
          ccof_facility: '9999',
          annotationid: '42434',
          filename,
        },
      ],
    });

    mountWithPinia({
      application: {
        isRenewal: true,
        programYearId,
        applicationStatus: APPLICATION_STATUSES.DRAFT,
        programYearLabel: 'TEST 2025XX',
        applicationMap: new Map([[programYearId, { applicationId }]]),
      },
      navBar: {
        navBarList: [
          {
            facilityId: '9999',
            facilityName,
            facilityAccountNumber,
            licenseNumber,
          },
        ],
      },
    });
    cy.contains(filename);
    cy.get('.mdi-delete');
  });

  it('should render file upload input', () => {
    interceptAPI();
    mountWithPinia({
      navBar: {
        navBarList: [{}],
      },
      application: {
        programYearId,
        applicationMap: new Map([[programYearId, { applicationId }]]),
      },
    });
    cy.get('.v-file-input').should('exist');
  });
});
