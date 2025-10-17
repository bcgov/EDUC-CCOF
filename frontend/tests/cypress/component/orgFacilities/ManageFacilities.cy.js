import ManageFacilities from '@/components/orgFacilities/ManageFacilities.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes, FUNDING_AGREEMENTS_STATUS, ORGANIZATION_FACILITY_STATUS_CODES } from '@/utils/constants';

const organizationId = '1234';

const activeFacility = {
  facilityName: 'Test Medical Clinic',
  facilityAccountNumber: 'FAC-104839',
  facilityIsActive: false,
  licenseNumber: 'LIC-BC-99821',
  action: '',
  addressLineOne: '123 Test Street',
  city: 'Victoria',
  statusCode: ORGANIZATION_FACILITY_STATUS_CODES.ACTIVE,
};

const inActiveFacility = {
  facilityName: 'Fake Medical Clinic',
  facilityAccountNumber: 'GRL-135612',
  facilityIsActive: true,
  licenseNumber: 'LZS-BC-31121',
  action: '',
  addressLineOne: '543 Fake Street',
  city: 'Vancouver',
};

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();

    cy.mount(ManageFacilities, {
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

function interceptRequests(response = []) {
  cy.intercept('GET', `${ApiRoutes.ORGANIZATION}/${organizationId}/facilities`, {
    statusCode: 200,
    body: response,
  }).as('getFacilities');
}

describe('<ManageFaciltiies />', () => {
  beforeEach(() => {
    globalThis.localStorage.setItem('jwtToken', 'mocked-jwt-token');
  });

  afterEach(() => {
    globalThis.localStorage.removeItem('jwtToken');
  });

  it('should render main page text', () => {
    interceptRequests();
    mountWithPinia({
      organization: {
        organizationId,
      },
    });
    cy.wait('@getFacilities');
    cy.contains('p', 'View and manage the facilities of your organization.');
    cy.contains('h3', 'Active Facilities');
    cy.contains('h3', 'Inactive Facilities');
    cy.get('table').should('have.length', 2);
  });

  it('should render inactive facilities', () => {
    interceptRequests([inActiveFacility]);

    mountWithPinia({
      organization: {
        organizationId,
      },
    });

    cy.wait('@getFacilities');
    cy.get('table')
      .eq(1)
      .within(() => {
        cy.get('td').eq(0).should('contain', 'Facility Name').and('contain', inActiveFacility.facilityName);
        cy.get('td').eq(1).should('contain', 'Facility Address').and('contain', inActiveFacility.addressLineOne);
        cy.get('td').eq(2).should('contain', 'Facility ID').and('contain', inActiveFacility.facilityAccountNumber);
        cy.get('td').eq(3).should('contain', 'Licence Number').and('contain', inActiveFacility.licenseNumber);
      });
  });

  it('should render active facilities', () => {
    const programYearId = '1222';

    interceptRequests([activeFacility]);

    mountWithPinia({
      organization: {
        organizationId,
      },
      application: {
        programYearId,
        applicationMap: new Map([
          [programYearId, { fundingAgreementNumber: '###', internalStatus: FUNDING_AGREEMENTS_STATUS.ACTIVE }],
        ]),
      },
    });

    cy.wait('@getFacilities');

    cy.get('table')
      .eq(0)
      .within(() => {
        cy.get('td').eq(0).should('contain', 'Facility Name').and('contain', activeFacility.facilityName);
        cy.get('td').eq(1).should('contain', 'Facility Address').and('contain', activeFacility.addressLineOne);
        cy.get('td').eq(2).should('contain', 'Facility ID').and('contain', activeFacility.facilityAccountNumber);
        cy.get('td').eq(3).should('contain', 'Licence Number').and('contain', activeFacility.licenseNumber);
      });
  });

  it('should display no data available', () => {
    interceptRequests();
    mountWithPinia({
      organization: {
        organizationId,
      },
    });

    cy.wait('@getFacilities');
    cy.contains('No data available');
  });
});
