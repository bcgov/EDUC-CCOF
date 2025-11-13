import EceweEligibility from '@/components/eceweApplication/EceweEligibility.vue';
import vuetify from '@/plugins/vuetify';

const organizationName = 'Test-Org-Name';
const changeRecGuid = '44434';

function mountWithPinia(initialState, routeParams) {
  initialState = initialState || {};
  routeParams = routeParams || { urlGuid: changeRecGuid };

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
      application: {
        programYearLabel: 'Test 2025',
      },
      auth: {
        userInfo: {
          organizationName,
        },
      },
    });
    cy.contains('div', 'Child Care Operating Funding Program - 2025 Program Confirmation Form');
    cy.contains('div', organizationName);
  });

  it('should render alert', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          organizationName,
        },
      },
    });

    cy.get('.v-alert').within(() => {
      cy.contains('Note: Please read and understand the full eligibility requirements in the');
      cy.contains('a', 'ECE-WE Funding Guidelines').should('have.attr', 'href');
    });
  });

  it('should render ecewe eligibility questions', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          organizationName,
        },
      },
      eceweApp: {
        isStarted: true,
        facilities: [{ changeReqestId: changeRecGuid }, {}],
        eceweModel: {
          applicationId: '3333',
          optInECEWE: 'yes',
          belongsToUnion: 'yes',
        },
      },
    });

    cy.contains('For the funding term, would you like to opt-in to ECE-WE for any facility in your organization?');
    cy.get('.v-radio-group').within(() => {
      cy.get('.v-radio').should('have.length', 2);
      cy.contains('label', 'Yes');
      cy.contains('label', 'No');
    });
  });

  it('should render navigation buttons', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          organizationName,
        },
      },
    });
    cy.contains('button', 'Back');
    cy.contains('button', 'Next');
    cy.contains('button', 'Save');
  });
});
