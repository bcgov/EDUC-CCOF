import ManageOrgFacilities from '@/components/orgFacilities/ManageOrgFacilities.vue';
import vuetify from '@/plugins/vuetify';
import { PATHS } from '@/utils/constants.js';
import { PERMISSIONS } from '@/utils/constants/permissions';

const organizationName = 'TEST-ORG-NAME';
const organizationAccountNumber = 4356;

const permissionsWithoutViewFundingAgreement = Object.values(PERMISSIONS).filter(
  (permission) => permission !== PERMISSIONS.VIEW_FUNDING_AGREEMENT,
);

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

  it('should contain only `Organization Information` and `Facilities` tab', () => {
    mountWithPinia({
      organization: {
        organizationName,
        organizationAccountNumber,
      },
    });
    cy.get('.v-tab').should('have.length', 2);
    cy.get('.v-tab').eq(0).should('contain', 'Organization Information');
    cy.get('.v-tab').eq(1).should('contain', 'Facilities');
  });

  it('should render `Funding Agreement` tab button', () => {
    mountWithPinia({
      organization: {
        organizationName,
        organizationAccountNumber,
      },
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
        isAuthenticated: true,
        permissions: [PERMISSIONS.VIEW_FUNDING_AGREEMENT],
      },
    });

    cy.get('.v-tab').should('have.length', 3);
    cy.get('.v-tab').eq(1).should('contain', 'Funding Agreement');
  });

  it('should not render `Funding Agreement` button without view funding agreement permission', () => {
    mountWithPinia({
      organization: {
        organizationName,
        organizationAccountNumber,
      },
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
        isAuthenticated: true,
        permissions: [permissionsWithoutViewFundingAgreement],
      },
    });

    cy.get('.v-tab').contains('Funding Agreement').should('not.exist');
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
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
        isAuthenticated: true,
        permissions: [PERMISSIONS.VIEW_FUNDING_AGREEMENT],
      },
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
