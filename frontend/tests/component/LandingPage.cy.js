import { ORGANIZATION_GOOD_STANDING_STATUSES, PATHS, pcfUrl } from '../../src/utils/constants';

import LandingPage from '@/Components/LandingPage.vue';
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

  it('should display only organization id', () => {
    const pinia = createTestingPinia({
      createSpy: cy.spy,
      stubActions: false,
      initialState: {
        organization: {
          organizationAccountNumber: 'ORG-12345',
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
    cy.contains('Organization Name:').should('not.exist');
  });

  it('should display only organization name', () => {
    const pinia = createTestingPinia({
      createSpy: cy.spy,
      stubActions: false,
      initialState: {
        organization: {
          organizationName: 'Test Name',
        },
      },
    });

    setActivePinia(pinia);

    cy.mount(LandingPage, {
      global: {
        plugins: [pinia, vuetify],
      },
    });

    cy.contains('Organization Name: Test Name').should('exist');
  });

  it('should not render the div if both org account number and name are missing', () => {
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
      initialState: {
        auth: {
          userInfo: {
            organizationGoodStandingStatus: '',
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

  it('should display application alert if not good standing', () => {
    const pinia = createTestingPinia({
      createSpy: cy.spy,
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

  it('should show approved message when applicationType is RENEW and actions required is empty', () => {
    const pinia = createTestingPinia({
      createSpy: cy.spy,
      initialState: {
        application: {
          applicationType: 'RENEW',
          applicationMap: new Map(),
        },
        auth: {
          userInfo: {
            serverTime: new Date(),
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

    cy.contains('Child Care Operating Funding (CCOF)').should('exist');
    cy.contains('Apply for Child Care Operating Funding (CCOF) including:').should('not.exist');
  });

  it('should show approved message when ccofStatus is APPROVED', () => {
    const pinia = createTestingPinia({
      createSpy: cy.spy,
      initialState: {
        application: {
          applicationType: 'APPROVED',
          applicationMap: new Map(),
        },
        auth: {
          userInfo: {
            serverTime: new Date(),
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

    cy.contains('Child Care Operating Funding (CCOF)').should('exist');
    cy.contains('Apply for Child Care Operating Funding (CCOF) including:').should('not.exist');
  });

  it('should show apply for CCOF message when not isCCOFApproved ', () => {
    const pinia = createTestingPinia({
      createSpy: cy.spy,
      initialState: {
        application: {
          applicationType: '',
          applicationMap: new Map(),
        },
        auth: {
          userInfo: {
            serverTime: new Date(),
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

    cy.contains('Apply for Child Care Operating Funding (CCOF) including:').should('exist');
  });

  it('should display new application titles only', () => {
    cy.mount({
      extends: LandingPage,
      global: {
        plugins: [createTestingPinia({ createSpy: cy.spy }), vuetify],
      },
      computed: {
        isCCOFApproved() {
          return false;
        },
        getActionRequiredApplicationsForCCOFCard() {
          return [''];
        },
        ccofStatus() {
          return '';
        },
      },
    });

    cy.contains('li', 'CCOF Base Funding').should('exist');
    cy.contains('li', 'Child Care Fee Reduction Initiative (CCFRI) Funding').should('exist');
    cy.contains('li', 'Early Childhood Educator Wage Enhancement (ECE-WE) Funding').should('exist');

    cy.contains('div', 'Base Funding assists eligible licensed').should('not.exist');
    cy.contains('div', 'The CCFRI offers funding to eligible,').should('not.exist');
    cy.contains('div', 'Providers with licensed care facilities').should('not.exist');
  });

  it('should display new application body', () => {
    const pinia = createTestingPinia({
      createSpy: cy.spy,
      initialState: {
        application: {
          applicationType: null,
        },
      },
    });

    setActivePinia(pinia);

    cy.mount(LandingPage, {
      global: {
        plugins: [createTestingPinia({ createSpy: cy.spy }), vuetify],
      },
    });

    cy.contains('div', 'Base Funding assists eligible licensed').should('exist');
    cy.contains('div', 'The CCFRI offers funding to eligible,').should('exist');
    cy.contains('div', 'Providers with licensed care facilities').should('exist');
  });

  it('should display info paragraph and link when ccofStatus is NEW', () => {
    const pinia = createTestingPinia({
      createSpy: cy.spy,
      initialState: {
        application: {
          applicationType: null,
        },
      },
    });
    cy.mount(LandingPage, {
      global: {
        plugins: [pinia, vuetify],
      },
    });

    cy.get('p.pt-2').contains('For more information, visit the government website').should('exist');
    cy.get('a')
      .should(
        'have.attr',
        'href',
        'https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/childcarebc-programs/child-care-operating-funding',
      )
      .and('contain.text', 'gov.bc.ca/childcareoperatingfunding');
  });

  it('should not display info paragraph and link when ccofStatus is not new', () => {
    const pinia = createTestingPinia({
      createSpy: cy.spy,
      initialState: {
        application: {
          applicationType: 'PLACEHOLDER',
        },
      },
    });

    cy.mount(LandingPage, {
      global: {
        plugins: [pinia, vuetify],
      },
    });

    cy.contains('p.pt-2', 'For more information').should('not.exist');
  });

  it('should display Start Application and route to intermediate page when clicked', () => {
    const pinia = createTestingPinia({
      createSpy: cy.spy,
      stubActions: false,
      initialState: {
        app: {
          programYearList: {
            newApp: {
              programYearId: '1234',
            },
          },
        },
      },
    });

    const push = cy.stub().as('routerPush');

    cy.mount(LandingPage, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push,
          },
        },
      },
    });
    cy.contains('Fiscal year runs April 1 to March 31');
    cy.contains('button', 'Start Application').click();
    cy.get('@routerPush').should('have.been.calledWith', pcfUrl(PATHS.NEW_APPLICATION_INTERMEDIATE, '1234'));
  });

  it('should display cancel application button', () => {
    const pinia = createTestingPinia({
      createSpy: cy.spy,
      stubActions: false,
      initialState: {
        application: {
          applicationType: 'NEW',
          applicationStatus: 'DRAFT',
        },
      },
    });

    cy.mount(LandingPage, {
      global: {
        plugins: [pinia, vuetify],
      },
    });
    cy.contains('Status: Incomplete');
    cy.contains('button', 'Continue Application').should('exist');
  });
});
