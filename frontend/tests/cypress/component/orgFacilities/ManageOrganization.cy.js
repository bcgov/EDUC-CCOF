import ManageOrganization from '@/components/orgFacilities/ManageOrganization.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes } from '@/utils/constants';

const organizationId = '1234';

const organizationResponse = {
  legalName: 'Green Valley Health Services',
  incNumber: 987654,
  doingBusinessAs: 'GV Health',
  accountNumber: 'GVH-202510',
  organizationTypeDesc: 'Non-Profit Organization',
  email: 'info@greenvalleyhealth.org',
  phone: '604-555-7890',
  website: 'https://www.greenvalleyhealth.org',
  address1: '456 Wellness Blvd',
  city1: 'Vancouver',
  province1: 'British Columbia',
  postalCode1: 'V5K 0A1',
  address2: 'Building B, Floor 3',
  city2: 'Vancouver',
  province2: 'British Columbia',
  postalCode2: 'V5K 0A2',
};

function mountWithPinia(initialState = {}, overrideProps = {}) {
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

    cy.intercept('GET', `${ApiRoutes.ORGANIZATION}/${organizationId}`, {
      statusCode: 200,
      body: organizationResponse,
    }).as('updateFacilityDetails');
  });

  afterEach(() => {
    globalThis.localStorage.removeItem('jwtToken');
  });

  it('should render general component information', () => {
    mountWithPinia({
      organization: {
        organizationId,
      },
    });
    cy.contains('p', 'View and update your organization information.');
    cy.contains('h2', 'Organization Info');
    cy.contains('button', 'Request a Change');
  });

  it('should navigate to change request', () => {
    mountWithPinia({
      organization: {
        organizationId,
      },
    });
    cy.contains('button', 'Request a Change').click();
    cy.get('@routerPush').should('have.been.calledWith', { name: 'Report Change' });
  });
});
