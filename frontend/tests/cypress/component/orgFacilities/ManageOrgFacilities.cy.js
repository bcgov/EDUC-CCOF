import ManageOrgFacilities from '@/components/orgFacilities/ManageOrgFacilities.vue';
import vuetify from '@/plugins/vuetify';
import { PATHS } from '@/utils/constants.js';
import { PERMISSIONS } from '@/utils/constants/permissions';

const organizationName = 'TEST-ORG-NAME';
const organizationAccountNumber = 4356;

function createAuth(permissions) {
  return {
    auth: {
      userInfo: {
        serverTime: new Date(),
      },
      isAuthenticated: true,
      permissions,
    },
  };
}

function mountWithPinia(initialState = {}, tab = 'organization-tab') {
  cy.setupPinia({ initialState }).then((pinia) => {
    const pushStub = cy.stub();
    const isReadyStub = cy.stub().returns(Promise.resolve());

    const mockRoute = {
      query: {
        tab,
      },
    };

    cy.mount(ManageOrgFacilities, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            isReady: isReadyStub,
            push: pushStub,
          },
          $route: mockRoute,
        },
      },
    });
    cy.wrap(pushStub).as('routerPush');
    cy.wrap(isReadyStub).as('readyStub');
  });
}

describe('<ManageOrgFacilities />', () => {
  it('should render organization name and account number', () => {
    mountWithPinia({
      organization: {
        organizationName,
        organizationAccountNumber,
      },
    });
    cy.contains('h1', 'Organization and Facilities');
    cy.contains('b', organizationName);
    cy.contains(`ID: ${organizationAccountNumber}`);
  });

  it('should contain no tabs without permissions', () => {
    mountWithPinia({
      organization: {
        organizationName,
        organizationAccountNumber,
      },
    });
    cy.get('.v-tab').should('have.length', 0);
  });

  it('should contain only `Organization Information` tab', () => {
    mountWithPinia({
      organization: {
        organizationName,
        organizationAccountNumber,
      },
      ...createAuth([PERMISSIONS.VIEW_ORG_INFORMATION]),
    });
    cy.get('.v-tab').should('have.length', 1);
    cy.get('.v-tab').eq(0).should('contain', 'Organization Information');
  });

  it('should not contain `Organization Information` tab', () => {
    const permWithoutViewOrg = Object.values(PERMISSIONS).filter(
      (permission) => permission !== PERMISSIONS.VIEW_ORG_INFORMATION,
    );

    mountWithPinia({
      organization: {
        organizationName,
        organizationAccountNumber,
      },
      ...createAuth(permWithoutViewOrg),
    });
    cy.get('.v-tab').should('have.length', 2);
    cy.get('.v-tab').should('not.contain', 'Organization Information');
  });

  it('should contain only `Facilities` tab', () => {
    mountWithPinia({
      organization: {
        organizationName,
        organizationAccountNumber,
      },
      ...createAuth([PERMISSIONS.VIEW_FACILITY_INFORMATION]),
    });
    cy.get('.v-tab').should('have.length', 1);
    cy.get('.v-tab').eq(0).should('contain', 'Facilities');
  });

  it('should not contain `Facilities` tab', () => {
    const permWithoutViewFac = Object.values(PERMISSIONS).filter(
      (permission) => permission !== PERMISSIONS.VIEW_FACILITY_INFORMATION,
    );

    mountWithPinia({
      organization: {
        organizationName,
        organizationAccountNumber,
      },
      ...createAuth(permWithoutViewFac),
    });
    cy.get('.v-tab').should('have.length', 2);
    cy.get('.v-tab').should('not.contain', 'Facilities');
  });

  it('should contain only `Funding Agreement` tab', () => {
    mountWithPinia({
      organization: {
        organizationName,
        organizationAccountNumber,
      },
      ...createAuth([PERMISSIONS.VIEW_FUNDING_AGREEMENT]),
    });

    cy.get('.v-tab').should('have.length', 1);
    cy.get('.v-tab').eq(0).should('contain', 'Funding Agreement');
  });

  it('should not contain `Funding Agreement` button', () => {
    const permWithoutViewFundingAgreement = Object.values(PERMISSIONS).filter(
      (permission) => permission !== PERMISSIONS.VIEW_FUNDING_AGREEMENT,
    );

    mountWithPinia({
      organization: {
        organizationName,
        organizationAccountNumber,
      },
      ...createAuth(permWithoutViewFundingAgreement),
    });

    cy.get('.v-tab').contains('Funding Agreement').should('not.exist');
  });

  it('should contain all tabs', () => {
    mountWithPinia({
      organization: {
        organizationName,
        organizationAccountNumber,
      },
      ...createAuth([
        PERMISSIONS.VIEW_ORG_INFORMATION,
        PERMISSIONS.VIEW_FUNDING_AGREEMENT,
        PERMISSIONS.VIEW_FACILITY_INFORMATION,
      ]),
    });
    cy.get('.v-tab').should('have.length', 3);
    cy.get('.v-tab').eq(0).should('contain', 'Organization Information');
    cy.get('.v-tab').eq(1).should('contain', 'Funding Agreement');
    cy.get('.v-tab').eq(2).should('contain', 'Facilities');
  });

  it('should render manage organization content', () => {
    mountWithPinia({
      organization: {
        organizationName,
        organizationAccountNumber,
      },
    });

    cy.contains('View and update your organization information.');
    cy.contains('Organization Info');
    cy.contains('button', 'Request a Change');
  });

  it('should navigate and render the facilities content', () => {
    mountWithPinia({
      organization: {
        organizationName,
        organizationAccountNumber,
      },
      ...createAuth([PERMISSIONS.VIEW_FACILITY_INFORMATION]),
    });

    cy.contains('button', 'Facilities').click();
    cy.contains('View and manage the facilities of your organization.');
    cy.contains('Active Facilities');
  });

  it('should navigate and render the Funding Agreement content', () => {
    mountWithPinia({
      organization: {
        organizationName,
        organizationAccountNumber,
      },
      ...createAuth([PERMISSIONS.VIEW_FUNDING_AGREEMENT]),
    });

    cy.contains('button', 'Funding Agreement').click();
    cy.contains('View and manage the funding agreements for your organization');
    cy.contains('Select a funding agreement term:');
  });

  it('should navigate back to home page', () => {
    mountWithPinia({
      organization: {
        organizationName,
        organizationAccountNumber,
      },
    });

    cy.contains('Back').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.HOME);
  });
});
