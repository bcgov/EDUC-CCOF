import OrganizationClosures from '@/components/closure/OrganizationClosures.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes, CLOSURE_STATUSES } from '@/utils/constants.js';
import { PERMISSIONS } from '@/utils/constants/permissions.js';

const programYearGuid = '43242';
const organizationId = '04324';

const closureData = {
  facilityId: '432432',
  facilityName: 'TestFacName',
  startDate: '2025-01-10',
  endDate: '2025-01-15',
  closureStatus: CLOSURE_STATUSES.PENDING,
  paymentEligibility: 100000000,
  action: '',
};

const createAppStore = () => ({
  app: {
    programYearList: {
      list: [
        {
          programYearId: programYearGuid,
          name: 'TESTTEST',
        },
      ],
    },
  },
});

function interceptAPI() {
  cy.intercept('GET', `${ApiRoutes.CLOSURES}?organizationId=${organizationId}&programYearId=${programYearGuid}`, {
    statusCode: 200,
    body: [closureData],
  }).as('getLicenseCategories');
}

function mountWithPinia({ initialState = {} } = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(OrganizationClosures, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $route: {
            params: {
              programYearGuid,
            },
          },
        },
      },
    });
  });
}

describe('<OrganizationClosures /> ', () => {
  beforeEach(() => {
    globalThis.localStorage.setItem('jwtToken', 'mocked-jwt-token');
  });

  afterEach(() => {
    globalThis.localStorage.removeItem('jwtToken');
  });

  it('should render top org information', () => {
    const organizationName = 'TESTORGNAME';
    const organizationAccountNumber = '54321';
    mountWithPinia({
      initialState: {
        ...createAppStore(),
        organization: {
          organizationName,
          organizationAccountNumber,
        },
      },
    });

    cy.contains('Organization Closures');
    cy.contains(organizationName);
    cy.contains(`Organization ID: ${organizationAccountNumber}`);
  });

  it('should render `Add New Closure` button if has proper permissions', () => {
    mountWithPinia({
      initialState: {
        ...createAppStore(),
        auth: {
          isAuthenticated: true,
          permissions: [PERMISSIONS.REQUEST_CLOSURE],
        },
      },
    });
    cy.contains('button', 'Add New Closure');
  });

  it('should not render `Add New Closure` button if no proper permissions', () => {
    const permWithoutReqClosure = Object.values(PERMISSIONS).filter(
      (permission) => permission !== PERMISSIONS.REQUEST_CLOSURE,
    );
    mountWithPinia({
      initialState: {
        ...createAppStore(),
        auth: {
          isAuthenticated: true,
          permissions: [permWithoutReqClosure],
        },
      },
    });
    cy.contains('button', 'Add New Closure').should('not.exist');
  });

  it('should render app alert', () => {
    mountWithPinia({
      initialState: {
        ...createAppStore(),
      },
    });
    cy.contains('p', 'Note: You can only submit closures for the current funding agreement term.');
    cy.contains('p', 'To report a closure for a previous term, please return to the home page');
  });

  it('should render filter by fac name and fac id text field', () => {
    mountWithPinia({
      initialState: {
        ...createAppStore(),
      },
    });
    cy.contains('label', 'Filter by Facility Name and Facility ID');
  });

  it('should render table content', () => {
    const expectedCells = [
      ['Facility ID'],
      ['Facility Name', closureData.facilityName],
      ['Start Date', closureData.startDate],
      ['End Date', closureData.endDate],
      ['Status', 'Pending'],
      ['Payment Eligibility', 'CCFRI'],
      ['Actions', 'View Details'],
    ];

    interceptAPI();

    mountWithPinia({
      initialState: {
        ...createAppStore(),
        organization: {
          organizationId,
        },
      },
    });

    cy.get('tbody tr')
      .first()
      .within(() => {
        cy.get('td').should('have.length', expectedCells.length);

        cy.get('td').each((cell, index) => {
          expectedCells[index].forEach((text) => {
            cy.wrap(cell).contains(text);
          });
        });
      });
  });

  it('should render `Update` button', () => {
    interceptAPI();
    mountWithPinia({
      initialState: {
        ...createAppStore(),
        auth: {
          isAuthenticated: true,
          permissions: [PERMISSIONS.EDIT_CLOSURE],
        },
        organization: {
          organizationId,
        },
      },
    });
    cy.contains('button', 'Update');
  });

  it('should not render `Update` button', () => {
    const permWithoutEditClosure = Object.values(PERMISSIONS).filter(
      (permission) => permission !== PERMISSIONS.EDIT_CLOSURE,
    );

    interceptAPI();
    mountWithPinia({
      initialState: {
        ...createAppStore(),
        auth: {
          isAuthenticated: true,
          permissions: [permWithoutEditClosure],
        },
        organization: {
          organizationId,
        },
      },
    });
    cy.contains('button', 'Update').should('not.exist');
  });

  it('should render `Remove` button', () => {
    interceptAPI();
    mountWithPinia({
      initialState: {
        ...createAppStore(),
        auth: {
          isAuthenticated: true,
          permissions: [PERMISSIONS.REMOVE_CLOSURE],
        },
        organization: {
          organizationId,
        },
      },
    });
    cy.contains('button', 'Remove');
  });

  it('should not render `Remove` button', () => {
    const permWithoutRemoveClosure = Object.values(PERMISSIONS).filter(
      (permission) => permission !== PERMISSIONS.REMOVE_CLOSURE,
    );

    interceptAPI();
    mountWithPinia({
      initialState: {
        ...createAppStore(),
        auth: {
          isAuthenticated: true,
          permissions: [permWithoutRemoveClosure],
        },
        organization: {
          organizationId,
        },
      },
    });
    cy.contains('button', 'Update').should('not.exist');
  });
});
