import ManageFacility from '@/components/orgFacilities/ManageFacility.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes, FUNDING_AGREEMENTS_STATUS, ORGANIZATION_FACILITY_STATUS_CODES, PATHS } from '@/utils/constants.js';
import { PERMISSIONS } from '@/utils/constants/permissions';

const facilityId = '9876';

const facilityResponse = {
  facilityName: 'TEST_FACILITY',
  facilityAccountNumber: '3401',
  licenseNumber: 'A1234B',
  healthAuthority: 'Test Health Authority',
  organizationName: 'Test Healthcare Ltd.',
  phone: '250-555-5555',
  facilityAddress: '1234 Test St.',
  city: 'Victoria',
  province: 'British Columbia',
  postalCode: 'V00 000',
  email: 'contact@test.ca',
  facilityId: '23232',
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

  for (const key of Object.keys(defaultResponses)) {
    const { method, url, response } = { ...defaultResponses[key], ...overrides[key] };
    cy.intercept(method, url, { statusCode: 200, body: response }).as(key);
  }
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

  it('should render default tabs without any permissions', () => {
    const expectedTexts = ['Programs and Vacancies'];
    mountWithPinia({ ...createOrgStore() });

    cy.get('.v-tabs')
      .find('button')
      .should('have.length', 1)
      .each((button, index) => {
        cy.wrap(button).should('include.text', expectedTexts[index]);
      });
  });

  it('should render `Facility Details` tab', () => {
    const expectedTexts = ['Facility Details', 'Programs and Vacancies'];
    mountWithPinia({
      ...createOrgStore(),
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
        isAuthenticated: true,
        permissions: [PERMISSIONS.VIEW_FACILITY_INFORMATION],
      },
    });

    cy.get('.v-tabs')
      .find('button')
      .should('have.length', 2)
      .each((button, index) => {
        cy.wrap(button).should('include.text', expectedTexts[index]);
      });
  });

  it('should not render `Facility Details` tab', () => {
    const permWithoutViewFac = Object.values(PERMISSIONS).filter(
      (permission) => permission !== PERMISSIONS.VIEW_FACILITY_INFORMATION,
    );

    mountWithPinia({
      ...createOrgStore(),
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
        isAuthenticated: true,
        permissions: permWithoutViewFac,
      },
    });

    cy.get('.v-tabs').find('button').should('have.length', 2);
    cy.get('.v-tab').contains('Facility Detail').should('not.exist');
  });

  it('should render `Licence and Service Details Record` tab', () => {
    const expectedTexts = ['Programs and Vacancies', 'Licence and Service Details Record'];
    mountWithPinia({
      ...createOrgStore(),
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
        isAuthenticated: true,
        permissions: [PERMISSIONS.VIEW_LICENCE_INFORMATION],
      },
    });

    cy.get('.v-tabs')
      .find('button')
      .should('have.length', 2)
      .each((button, index) => {
        cy.wrap(button).should('include.text', expectedTexts[index]);
      });
  });

  it('should not render `Licence and Service Details Record` tab', () => {
    const permWithoutViewLicInfo = Object.values(PERMISSIONS).filter(
      (permission) => permission !== PERMISSIONS.VIEW_LICENCE_INFORMATION,
    );

    mountWithPinia({
      ...createOrgStore(),
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
        isAuthenticated: true,
        permissions: permWithoutViewLicInfo,
      },
    });

    cy.get('.v-tabs').find('button').should('have.length', 2);
    cy.get('.v-tab').contains('Licence and Service Details Record').should('not.exist');
  });

  it('should render all tabs with correct values', () => {
    const expectedTexts = ['Facility Details', 'Programs and Vacancies', 'Licence and Service Details Record'];
    mountWithPinia({
      ...createOrgStore(),
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
        isAuthenticated: true,
        permissions: [PERMISSIONS.VIEW_FACILITY_INFORMATION, PERMISSIONS.VIEW_LICENCE_INFORMATION],
      },
    });

    cy.get('.v-tabs')
      .find('button')
      .should('have.length', 3)
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
      auth: {
        userInfo: { serverTime: new Date(), organizationName: 'TEST_ORG' },
        isAuthenticated: true,
        permissions: [PERMISSIONS.VIEW_LICENCE_INFORMATION],
      },
    });

    cy.contains('button', 'Licence and Service Details Record').click();
    cy.contains('Review your Licence and Service Details Record.');
    cy.contains('You must notify the Child Care Operating Funding Program of changes to');
  });

  it('should navigate on clicking back button', () => {
    mountWithPinia({ ...createOrgStore() });
    cy.contains('button', 'Back').click();
    cy.get('@routerPush').should('have.been.calledWith', `${PATHS.ROOT.MANAGE_ORG_FACILITIES}?tab=facilities-tab`);
  });
});
