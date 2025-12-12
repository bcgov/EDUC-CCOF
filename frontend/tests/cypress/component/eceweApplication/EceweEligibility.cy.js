import EceweEligibility from '@/components/eceweApplication/EceweEligibility.vue';
import vuetify from '@/plugins/vuetify';

const PROGRAM_YEAR_ID = '1234';
const ORGANIZATION_NAME = 'Test-Org-Name';
const CHANGE_REC_GUID = '44434';

const createApplicationStore = (extras) => {
  return {
    application: {
      programYearLabel: 'Test 2025',
      programYearId: PROGRAM_YEAR_ID,
    },
  };
};

const createAppStore = (extras) => {
  return {
    app: {
      programYearList: {
        list: [
          {
            programYearId: PROGRAM_YEAR_ID,
            eceweFundingGuidelinesUrl: 'www.ecewe-test.com',
          },
        ],
      },
      ...extras,
    },
  };
};

const createAuthStore = () => {
  return {
    auth: {
      userInfo: {
        organizationName: ORGANIZATION_NAME,
      },
    },
  };
};

function mountWithPinia(initialState, routeParams) {
  initialState = initialState || {};
  routeParams = routeParams || { urlGuid: CHANGE_REC_GUID };

  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(EceweEligibility, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $route: {
            params: routeParams,
          },
        },
      },
    });
  });
}

describe('<EceweEligibility />', () => {
  it('should render  component header information', () => {
    mountWithPinia({
      ...createApplicationStore(),
      ...createAppStore(),
      ...createAuthStore(),
    });
    cy.contains('div', 'Child Care Operating Funding Program - 2025 Program Confirmation Form');
    cy.contains('div', ORGANIZATION_NAME);
  });

  it('should render alert', () => {
    mountWithPinia({
      ...createAuthStore(),
      ...createApplicationStore(),
      ...createAppStore(),
    });

    cy.get('.v-alert').within(() => {
      cy.contains('Note: Please read and understand the full eligibility requirements in the');
      cy.contains('a', 'ECE-WE Funding Guidelines').should('have.attr', 'href');
    });
  });

  it('should render ecewe eligibility questions', () => {
    mountWithPinia({
      ...createAuthStore(),
      ...createApplicationStore(),
      ...createAppStore(),
      eceweApp: {
        isStarted: true,
        facilities: [{ changeReqestId: CHANGE_REC_GUID }, {}],
        eceweModel: {
          applicationId: '3333',
          optInECEWE: 'yes',
          belongsToUnion: 'yes',
        },
      },
    });

    cy.contains('For the 2025 funding term, would you like to opt-in to ECE-WE for any facility in your organization?');
    cy.get('.v-radio-group').within(() => {
      cy.get('.v-radio').should('have.length', 2);
      cy.contains('label', 'Yes');
      cy.contains('label', 'No');
    });
  });

  it('should render navigation buttons', () => {
    mountWithPinia({
      ...createAuthStore(),
      ...createApplicationStore(),
      ...createAppStore(),
    });
    cy.contains('button', 'Back');
    cy.contains('button', 'Next');
    cy.contains('button', 'Save');
  });
});
