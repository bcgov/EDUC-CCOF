import ManageFacility from '@/components/orgFacilities/ManageFacility.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes, FUNDING_AGREEMENTS_STATUS, ORGANIZATION_FACILITY_STATUS_CODES, PATHS } from '@/utils/constants.js';

const facilityId = '9876';

const facilityResponse = {
  facilityName: 'Greenwood Medical Center',
  facilityAccountNumber: '3401',
  licenseNumber: 'A1234B',
  healthAuthority: 'Northern Health Authority',
  organizationName: 'Greenwood Healthcare Ltd.',
  phone: '250-555-0198',
  facilityAddress: '1234 Pine St.',
  city: 'Victoria',
  province: 'British Columbia',
  postalCode: 'V8Z 2R0',
  email: 'contact@greenwoodhealthcare.ca',
  facilityId: '55678',
  facilityCopy: true,
  statusCode: ORGANIZATION_FACILITY_STATUS_CODES.ACTIVE,
};

function createOrgStore(overrides = {}) {
  return {
    organization: {
      organizationProviderType: 'org-1234',
      ...overrides,
    },
  };
}

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    const isReadyStub = cy.stub().returns(Promise.resolve());

    const mockRoute = {
      query: {
        tab: 'facility-details',
      },
      params: {
        facilityId: facilityId,
      },
    };

    cy.mount(ManageFacility, {
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

function mockApiResponses(overrides = {}) {
  const defaultResponses = {
    getFacilities: {
      method: 'GET',
      url: `${ApiRoutes.FACILITY}/${facilityId}`,
      response: facilityResponse,
    },
  };

  Object.keys(defaultResponses).forEach((key) => {
    const { method, url, response } = { ...defaultResponses[key], ...overrides[key] };
    cy.intercept(method, url, { statusCode: 200, body: response }).as(key);
  });
}

describe('<ManageFacility />', () => {
  beforeEach(() => {
    mockApiResponses();
  });

  it('should render main header', () => {
    mountWithPinia({
      ...createOrgStore(),
    });
    cy.contains('h1', 'Facility Information');
  });

  it('should render facility details', () => {
    mountWithPinia({ ...createOrgStore() });

    cy.contains('b', facilityResponse.facilityName);
    cy.contains(`ID: ${facilityResponse.facilityAccountNumber}`);
    cy.contains(`Licence #: ${facilityResponse.licenseNumber}`);
  });

  it('should disable `Request a Change` button', () => {
    mountWithPinia({ ...createOrgStore() });

    cy.contains('Request a Change').should('exist').should('have.css', 'pointer-events', 'none');
  });

  it('should enable `Request a Change` button', () => {
    mountWithPinia({
      ...createOrgStore(),
      application: {
        programYearId: '111',
        applicationMap: new Map([
          [
            '111',
            {
              fundingAgreementNumber: true,
              internalStatus: FUNDING_AGREEMENTS_STATUS.ACTIVE,
            },
          ],
        ]),
      },
    });

    cy.contains('Request a Change').should('exist').should('not.have.css', 'pointer-events', 'none').click();
    cy.get('@routerPush').should('have.been.calledWith', { name: 'Report Change' });
  });

  it('should render tabs with correct values', () => {
    const expectedTexts = ['Facility Details', 'Licences', 'Programs and Services', 'Closures'];
    mountWithPinia({ ...createOrgStore() });

    cy.get('.v-tabs')
      .find('button')
      .should('have.length', 4)
      .each((button, index) => {
        cy.wrap(button).should('include.text', expectedTexts[index]);
      });
  });

  it('should render facility details with correct values', () => {
    mountWithPinia({ ...createOrgStore() });

    cy.contains('p', facilityResponse.facilityName);
    cy.contains('p', facilityResponse.facilityAccountNumber);
    cy.contains('p', facilityResponse.licenseNumber);
    cy.contains('p', facilityResponse.phone);
    cy.contains('p', facilityResponse.facilityAddress);
    cy.contains('p', facilityResponse.city);
    cy.contains('p', facilityResponse.province);
    cy.contains('p', facilityResponse.postalCode);
    cy.contains('p', facilityResponse.email);
  });

  it('should switch to `Licences` window', () => {
    cy.intercept('GET', `${ApiRoutes.LICENCES}?facilityId=${facilityId}`, { statusCode: 200, body: [] });

    mountWithPinia({
      ...createOrgStore(),
      auth: { userInfo: { organizationName: 'TEST_ORG' } },
    });
    cy.contains('button', 'Licences').click();
    cy.contains('Review and update your licence and service details. You may update your hours of operation directly.');
    cy.contains('To request changes to any other information to this tab, click Request a Change.');
  });

  it('should navigate on clicking back button', () => {
    mountWithPinia({ ...createOrgStore() });
    cy.contains('button', 'Back').click();
    cy.get('@routerPush').should('have.been.calledWith', `${PATHS.ROOT.MANAGE_ORG_FACILITIES}?tab=facilities-tab`);
  });
});
