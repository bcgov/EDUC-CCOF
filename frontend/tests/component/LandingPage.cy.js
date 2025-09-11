import LandingPage from '@/components/LandingPage.vue';
import { ORGANIZATION_GOOD_STANDING_STATUSES } from '@/utils/constants.js';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import vuetify from '@/plugins/vuetify';

describe('<LandingPage />', () => {
  it('should display organization id and name', () => {
    const pinia = createTestingPinia({
      createSpy: cy.spy,
      stubActions: false,
      initialState: {
        organization: {
          organizationAccountNumber: 'ORG-12345',
          organizationName: 'Test Organization',
        },
      },
    });

    setActivePinia(pinia);

    cy.mount(LandingPage, {
      global: {
        plugins: [pinia, vuetify],
      },
    });

    cy.contains('Organization ID: ORG-12345').should('exist');
    cy.contains('Organization Name: Test Organization').should('exist');
  });

  it('does not render the div if both values are missing', () => {
    const pinia = createTestingPinia({
      createSpy: cy.spy,
      stubActions: false,
      initialState: {
        organization: {
          organizationAccountNumber: '',
          organizationName: '',
        },
      },
    });

    setActivePinia(pinia);

    cy.mount(LandingPage, {
      global: {
        plugins: [pinia, vuetify],
      },
    });

    cy.contains('Organization ID:').should('not.exist');
    cy.contains('Organization Name:').should('not.exist');
  });

  it('should not display app alert if good standing', () => {
    const pinia = createTestingPinia({
      createSpy: cy.spy,
      stubActions: false,
      initialState: {
        auth: {
          userInfo: {
            organizationGoodStandingStatus: '',
            organizationBypassGoodStandingCheck: true,
          },
        },
      },
    });

    setActivePinia(pinia);

    cy.mount(LandingPage, {
      global: {
        plugins: [pinia, vuetify],
      },
    });
    cy.contains('Your organization is not in good standing with BC Registries and Online Services.').should(
      'not.exist',
    );
  });

  it('should display app alert if not good standing', () => {
    const pinia = createTestingPinia({
      createSpy: cy.spy,
      stubActions: false,
      initialState: {
        auth: {
          userInfo: {
            organizationGoodStandingStatus: ORGANIZATION_GOOD_STANDING_STATUSES.FAIL,
            organizationBypassGoodStandingCheck: false,
          },
        },
      },
    });

    cy.mount(LandingPage, {
      global: {
        plugins: [pinia, vuetify],
      },
    });

    cy.contains('Your organization is not in good standing with BC Registries and Online Services.');
  });
});
