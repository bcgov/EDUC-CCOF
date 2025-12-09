import ViewLicence from '@/components/licences/ViewLicence.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes, LICENCE_STATUSES } from '@/utils/constants.js';

const FACILITY_ID = 'FAC-1234';

const LICENCE = {
  licenceStatus: LICENCE_STATUSES.ACTIVE,
  licenceNumber: '101',
  licenceStartDate: '2025-01-01',
  recordStartDate: '2025-12-01',
  recordEndDate: null,
};

function mountWithPinia({ initialState = {}, propOverride = {} } = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(ViewLicence, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $route: {
            params: {
              facilityId: FACILITY_ID,
            },
          },
        },
      },
      props: {
        ...propOverride,
      },
    });
  });
}

function interceptAPI(LIC = {}) {
  cy.intercept('GET', `${ApiRoutes.LICENCES}?facilityId=${FACILITY_ID}`, {
    statusCode: 200,
    body: [LIC],
  });
}

describe('<ViewLicence />', () => {
  beforeEach(() => {
    cy.viewport(1080, 1080);
  });
  it('should render general component content', () => {
    interceptAPI();
    mountWithPinia();
    cy.contains('Review your Licence and Service Details Record.').should('exist');
    cy.contains('You must notify the Child Care Operating Funding Program of changes to your').should('exist');
    cy.contains('Community Care and Assisted Living Act Facility Licence Details').should('not.exist');
  });

  it('should render default expansion panels', () => {
    interceptAPI();
    mountWithPinia();
    cy.get('.v-expansion-panel-title').should('have.length', 2);
    cy.get('.v-expansion-panel-title').eq(0).should('have.text', 'Licence and Service Details Record');
    cy.get('.v-expansion-panel-title').eq(1).should('have.text', 'Record History');
  });

  it('should render `No active or approved licences` inside expansion panel if no active licence', () => {
    const nonActiveLic = { ...LICENCE, recordEndDate: '2025-12-31' };
    interceptAPI(nonActiveLic);
    mountWithPinia();

    cy.get('.v-expansion-panel-title').eq(0).click();
    cy.contains('No active or approved licences found.').should('exist');
  });

  it('should render service details component if active licence exists', () => {
    interceptAPI(LICENCE);
    mountWithPinia();

    cy.get('.v-expansion-panel-title').eq(0).click();
    cy.contains('No active or approved licences found.').should('not.exist');
    cy.contains('Community Care and Assisted Living Act Facility Licence Details').should('exist');
  });

  it('should render service details dialog when clicking `View Record`', () => {
    interceptAPI(LICENCE);
    mountWithPinia();

    cy.get('.v-expansion-panel-title').eq(1).click();
    cy.contains('button', 'View Record').click();
    cy.contains('Community Care and Assisted Living Act Facility Licence Details').should('exist');
  });
});
