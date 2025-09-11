import LandingPage from '@/components/LandingPage.vue';
import vuetify from '@/plugins/vuetify';
import { ORGANIZATION_GOOD_STANDING_STATUSES } from '@/utils/constants.js';

describe('<LandingPage />', () => {
  function mountWithPinia(initialState = {}) {
    cy.setupPinia({ initialState }).then((pinia) => {
      cy.mount(LandingPage, {
        global: {
          plugins: [pinia, vuetify],
        },
      });
    });
  }

  it('should display organization id and name', () => {
    mountWithPinia({
      organization: {
        organizationAccountNumber: 'ORG-12345',
        organizationName: 'Test Organization',
      },
    });

    cy.contains('Organization ID: ORG-12345').should('exist');
    cy.contains('Organization Name: Test Organization').should('exist');
  });

  it('should not render the div if both values are missing', () => {
    mountWithPinia({
      organization: {
        organizationAccountNumber: '',
        organizationName: '',
      },
    });

    cy.contains('Organization ID:').should('not.exist');
    cy.contains('Organization Name:').should('not.exist');
  });

  it('should not display app alert if good standing', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          organizationGoodStandingStatus: '',
          organizationBypassGoodStandingCheck: true,
        },
      },
    });

    cy.contains('Your organization is not in good standing with BC Registries and Online Services.').should(
      'not.exist',
    );
  });

  it('should display app alert if not good standing', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          organizationGoodStandingStatus: ORGANIZATION_GOOD_STANDING_STATUSES.FAIL,
          organizationBypassGoodStandingCheck: false,
        },
      },
    });

    cy.contains('Your organization is not in good standing with BC Registries and Online Services.').should('exist');
  });
});
