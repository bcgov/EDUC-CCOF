import ManageOrganization from '@/components/orgFacilities/ManageOrganization.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes, ORGANIZATION_TYPES } from '@/utils/constants';
import { PERMISSIONS } from '@/utils/constants/permissions';

const organizationId = '1234';

const organizationResponse = {
  legalName: 'Test Health Services',
  incNumber: 121212,
  doingBusinessAs: 'T Health',
  accountNumber: 'THS-777777',
  organizationTypeDesc: 'Non-Profit Organization',
  email: 'info@test.org',
  phone: '666-555-5555',
  website: 'https://www.test9999.org',
  address1: '456 Fake Blvd',
  city1: 'Vancouver',
  province1: 'British Columbia',
  postalCode1: 'V00 000',
  address2: 'Building B, Floor 3',
  city2: 'Vancouver',
  province2: 'British Columbia',
  postalCode2: 'V11 111',
};

const createOrganizationStore = (extras) => {
  return {
    organization: {
      organizationId,
      ...extras,
    },
  };
};

function interceptRequests(response) {
  cy.intercept('GET', `${ApiRoutes.ORGANIZATION}/${organizationId}`, {
    statusCode: 200,
    body: response,
  }).as('updateFacilityDetails');
}

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();

    cy.mount(ManageOrganization, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
        },
      },
    });

    cy.wrap(pushStub).as('routerPush');
  });
}

describe('<ManageOrganization />', () => {
  beforeEach(() => {
    globalThis.localStorage.setItem('jwtToken', 'mocked-jwt-token');
  });

  afterEach(() => {
    globalThis.localStorage.removeItem('jwtToken');
  });

  it('should render general component information', () => {
    interceptRequests(organizationResponse);
    mountWithPinia({
      ...createOrganizationStore(),
    });
    cy.contains('p', 'View and update your organization information.');
    cy.contains('h2', 'Organization Info');
  });

  it('should not render `Request a Change Request` button if no view change request permissions', () => {
    const permWithoutViewCR = Object.values(PERMISSIONS).filter((permission) => permission !== PERMISSIONS.VIEW_A_CR);

    interceptRequests(organizationResponse);
    mountWithPinia({
      ...createOrganizationStore(),
      auth: {
        permissions: permWithoutViewCR,
      },
    });
    cy.contains('button', 'Request a Change').should('not.exist');
  });

  it('should navigate to change request', () => {
    interceptRequests(organizationResponse);

    mountWithPinia({
      ...createOrganizationStore(),
      auth: {
        permissions: [PERMISSIONS.VIEW_A_CR],
      },
    });
    cy.contains('button', 'Request a Change').click();
    cy.get('@routerPush').should('have.been.calledWith', { name: 'Report Change' });
  });

  it('should render default organization info', () => {
    interceptRequests(organizationResponse);

    mountWithPinia({
      ...createOrganizationStore(),
    });

    cy.get('.v-card')
      .eq(0)
      .within(() => {
        cy.get('.v-row')
          .should('contain.text', 'Organization Name:')
          .and('contain.text', organizationResponse.legalName);

        cy.get('.v-row')
          .should('contain.text', 'Doing Business As:')
          .and('contain.text', organizationResponse.doingBusinessAs);

        cy.get('.v-row')
          .should('contain.text', 'Organization ID:')
          .and('contain.text', organizationResponse.accountNumber);

        cy.get('.v-row')
          .should('contain.text', 'Organization Type:')
          .and('contain.text', organizationResponse.organizationTypeDesc);

        cy.get('.v-row').should('contain.text', 'Email Address:').and('contain.text', organizationResponse.email);
      });
  });

  it('should not render incorporation number', () => {
    interceptRequests(organizationResponse);

    mountWithPinia({
      ...createOrganizationStore(),
    });

    cy.get('.v-card')
      .eq(0)
      .within(() => {
        cy.get('.v-row')
          .should('not.contain.text', 'Incorporation Number:')
          .and('not.contain.text', organizationResponse.incNumber);
      });
  });

  it('should render incorporation number', () => {
    interceptRequests({ ...organizationResponse, organizationType: ORGANIZATION_TYPES.NON_PROFIT_SOCIETY });

    mountWithPinia({
      ...createOrganizationStore(),
    });

    cy.get('.v-card')
      .eq(0)
      .within(() => {
        cy.get('.v-row')
          .should('contain.text', 'Incorporation Number:')
          .and('contain.text', organizationResponse.incNumber);
      });
  });

  it('should not render edit buttons without permissions', () => {
    const permissionsWithoutChangeOrgInfo = Object.values(PERMISSIONS).filter(
      (permission) => permission !== PERMISSIONS.CHANGE_ORG_INFORMATION,
    );
    interceptRequests(organizationResponse);

    mountWithPinia({
      ...createOrganizationStore(),
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
        isAuthenticated: true,
        permissions: [permissionsWithoutChangeOrgInfo],
      },
    });

    cy.get('.v-card')
      .eq(0)
      .within(() => {
        cy.contains('button', 'Edit').should('not.exist');
      });
  });

  it('should render edit buttons with proper permissions', () => {
    interceptRequests(organizationResponse);

    mountWithPinia({
      ...createOrganizationStore(),
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
        isAuthenticated: true,
        permissions: [PERMISSIONS.CHANGE_ORG_INFORMATION],
      },
    });

    cy.get('.v-card')
      .eq(0)
      .within(() => {
        cy.contains('button', 'Edit').should('exist');
        cy.get('button').should('have.length', 3);
      });
  });

  it('should render organization address info', () => {
    interceptRequests(organizationResponse);

    mountWithPinia({
      ...createOrganizationStore(),
    });

    cy.get('.v-card')
      .eq(1)
      .within(() => {
        cy.get('.v-row').should('contain.text', 'Street Address:').and('contain.text', organizationResponse.address1);
        cy.get('.v-row').should('have.length', 10);
      });
  });
});
