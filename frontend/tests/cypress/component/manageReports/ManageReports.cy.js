import { createPinia, setActivePinia } from 'pinia';

import ManageReports from '@/components/manageReports/ManageReports.vue';
import vuetify from '@/plugins/vuetify';
import { APPLICATION_CCOF_STATUSES, APPLICATION_STATUSES, APPLICATION_TYPES, PATHS } from '@/utils/constants.js';

const organizationName = 'Test Organization';
const organizationAccountNumber = 'ORG-12345';

function createOrganizationStore(overrides = {}) {
  return {
    organization: {
      organizationName,
      organizationAccountNumber,
      ...overrides,
    },
  };
}

function createApplicationStore(overrides = {}) {
  return {
    application: {
      applicationType: APPLICATION_TYPES.RENEWAL,
      applicationStatus: APPLICATION_STATUSES.SUBMITTED,
      ccofApplicationStatus: APPLICATION_CCOF_STATUSES.APPROVED,
      unlockDeclaration: false,
      unlockEcewe: false,
      unlockLicenseUpload: false,
      unlockSupportingDocuments: false,
      ...overrides,
    },
  };
}

function createNavBarStore(overrides = {}) {
  return {
    navBar: {
      navBarList: [],
      ...overrides,
    },
  };
}

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub().as('routerPush');
    const backStub = cy.stub().as('routerBack');

    cy.mount(ManageReports, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
            back: backStub,
          },
        },
      },
    });
  });
}

describe('<ManageReports />', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should display organization name and account number', () => {
    mountWithPinia({
      ...createOrganizationStore(),
      ...createApplicationStore(),
      ...createNavBarStore(),
    });

    cy.contains(organizationName).should('exist');
    cy.contains(`ID: ${organizationAccountNumber}`).should('exist');
  });

  it('should display the reminder alert', () => {
    mountWithPinia({
      ...createOrganizationStore(),
      ...createApplicationStore(),
      ...createNavBarStore(),
    });

    cy.contains(
      'REMINDER: As part of your month end activities please review and update your User Contacts, Organization Information, Facility Details and Program and Vacancies information to ensure your information is kept accurate and up-to-date.',
    ).should('exist');
  });

  it('should display the change notification note with link', () => {
    mountWithPinia({
      ...createOrganizationStore(),
      ...createApplicationStore(),
      ...createNavBarStore(),
    });

    cy.contains(
      'You must notify the Child Care Operating Funding Program within two business days of any change to your Facility Licence or Child Care Services.',
    ).should('exist');
    cy.contains('Submit a change request').should('exist');
  });

  it('should display Enrolment Report card', () => {
    mountWithPinia({
      ...createOrganizationStore(),
      ...createApplicationStore(),
      ...createNavBarStore(),
    });

    cy.contains('h2', 'Enrolment Report').should('exist');
    cy.contains(
      'Edit, submit, view, or adjust your enrolment reports to receive Child Care Operating Funding (CCOF) and/or the Child Care Fee Reduction Initiative (CCFRI).',
    ).should('exist');
    cy.contains('button', 'Manage Enrolment Report').should('exist');
  });

  it('should display Monthly ECE Report card', () => {
    mountWithPinia({
      ...createOrganizationStore(),
      ...createApplicationStore(),
      ...createNavBarStore(),
    });

    cy.contains('h2', 'Monthly ECE Report').should('exist');
    cy.contains(
      'Edit, submit, view, or adjust your Monthly ECE Report to receive the Early Childhood Educator Wage Enhancement (ECE-WE).',
    ).should('exist');
    cy.contains('button', 'Manage ECE Report').should('exist');
  });

  context('Navigation', () => {
    it('should navigate to enrolment reports when button is clicked', () => {
      mountWithPinia({
        ...createOrganizationStore(),
        ...createApplicationStore(),
        ...createNavBarStore(),
      });

      cy.contains('button', 'Manage Enrolment Report').click();
      cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.ENROLMENT_REPORTS);
    });

    it('should navigate to Manage ECE Reports when the button is clicked', () => {
      mountWithPinia({
        ...createOrganizationStore(),
        ...createApplicationStore(),
        ...createNavBarStore(),
      });

      const alertStub = cy.stub();
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub').callsFake(alertStub);
      });

      cy.contains('button', 'Manage ECE Report').click();
      cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.MANAGE_ECE_REPORTS);
    });

    it('should navigate to change request when link is clicked', () => {
      mountWithPinia({
        ...createOrganizationStore(),
        ...createApplicationStore(),
        ...createNavBarStore(),
      });

      cy.contains('a', 'Submit a change request').click();
      cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.CHANGE_LANDING);
    });

    it('should call router.back when previous button is clicked', () => {
      mountWithPinia({
        ...createOrganizationStore(),
        ...createApplicationStore(),
        ...createNavBarStore(),
      });

      cy.contains('button', 'Back').click();
      cy.get('@routerBack').should('have.been.called');
    });
  });

  context('CCOF Approval Status', () => {
    it(`should enable Enrolment Report button when application type is ${APPLICATION_TYPES.RENEWAL}`, () => {
      mountWithPinia({
        ...createOrganizationStore(),
        ...createApplicationStore({ applicationType: APPLICATION_TYPES.RENEWAL }),
        ...createNavBarStore(),
      });

      cy.contains('button', 'Manage Enrolment Report').should('have.css', 'pointer-events', 'auto');
      cy.contains('button', 'Manage Enrolment Report').should('be.visible').click();
    });

    it(`should enable Enrolment Report button when CCOF status is ${APPLICATION_CCOF_STATUSES.ACTIVE}`, () => {
      mountWithPinia({
        ...createOrganizationStore(),
        ...createApplicationStore({
          applicationType: APPLICATION_TYPES.NEW_ORG,
          applicationStatus: APPLICATION_STATUSES.SUBMITTED,
          ccofApplicationStatus: APPLICATION_CCOF_STATUSES.ACTIVE,
        }),
        ...createNavBarStore(),
      });

      cy.contains('button', 'Manage Enrolment Report').should('have.css', 'pointer-events', 'auto');
      cy.contains('button', 'Manage Enrolment Report').should('be.visible').click();
    });

    it('should disable Enrolment Report button when CCOF is not approved', () => {
      mountWithPinia({
        ...createOrganizationStore(),
        ...createApplicationStore({
          applicationType: APPLICATION_TYPES.NEW_ORG,
          ccofApplicationStatus: APPLICATION_CCOF_STATUSES.PENDING,
        }),
        ...createNavBarStore(),
      });

      cy.contains('button', 'Manage Enrolment Report').should('have.css', 'pointer-events', 'none');
    });

    it('should disable ECE Report button when CCOF is not approved', () => {
      mountWithPinia({
        ...createOrganizationStore(),
        ...createApplicationStore({
          applicationType: APPLICATION_TYPES.NEW_ORG,
          ccofApplicationStatus: APPLICATION_CCOF_STATUSES.PENDING,
        }),
        ...createNavBarStore(),
      });

      cy.contains('button', 'Manage ECE Report').should('have.css', 'pointer-events', 'none');
    });
  });

  context('Page Title', () => {
    it('should display the main heading', () => {
      mountWithPinia({
        ...createOrganizationStore(),
        ...createApplicationStore(),
        ...createNavBarStore(),
      });

      cy.contains('h1', 'Submit and Manage Facility Reports').should('exist');
    });
  });
});
