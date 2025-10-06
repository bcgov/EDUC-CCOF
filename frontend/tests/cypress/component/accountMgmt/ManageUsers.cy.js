import ManageUsers from '@/components/accountMgmt/ManageUsers.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes, PATHS } from '@/utils/constants';
import { PERMISSIONS } from '@/utils/constants/permissions.js';

const organizationId = '1234';
const userId = '123';

const portalUser = {
  contactid: '1',
  role: { roleNumber: 123, roleName: 'Portal User' },
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@test.com',
  isPortalUser: true,
  telephone: '250-999-9999',
};

const noRoleUser = {
  contactid: '2',
  role: { roleNumber: 123 },
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'Jane.Smith@test.com',
  isPortalUser: true,
  telephone: '250-123-4567',
};

const mockUser = {
  contactid: '3',
  role: { roleNumber: 123 },
  firstName: 'Anna',
  lastName: 'Brown',
  isPortalUser: true,
  telephone: '250-000-0000',
};

function mountWithPinia(initialState = {}, dataOverride = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    cy.mount(ManageUsers, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
        },
      },
      ...dataOverride,
    });
    cy.wrap(pushStub).as('routerPush');
  });
}

function mockApiResponses(overrides = {}) {
  const defaultResponses = {
    getFacilities: {
      method: 'GET',
      url: `${ApiRoutes.ORGANIZATION}/${organizationId}/facilities`,
      response: [],
    },
    getOrg: {
      method: 'GET',
      url: `${ApiRoutes.ORGANIZATION}/${organizationId}`,
      response: [],
    },
    getContacts: {
      method: 'GET',
      url: `${ApiRoutes.CONTACTS}/organization/${organizationId}`,
      response: [],
    },
  };

  for (const key of Object.keys(defaultResponses)) {
    const { method, url, response } = {
      ...defaultResponses[key],
      ...overrides[key],
    };
    cy.intercept(method, url, { statusCode: 200, body: response }).as(key);
  }
}

describe('<ManageUsers />', () => {
  beforeEach(() => {
    globalThis.localStorage.setItem('jwtToken', 'mocked-jwt-token');
    mockApiResponses();
  });

  afterEach(() => {
    globalThis.localStorage.removeItem('jwtToken');
  });

  context('Component Rendering Tests', () => {
    it('should display `Manage Users` component text', () => {
      mountWithPinia({ organization: { organizationId } });
      cy.contains('h1', 'Manage Users');
    });

    it('should render empty table for no contacts', () => {
      mountWithPinia({ organization: { organizationId } });
      cy.contains('No data available');
    });

    it('should display organization name and account number', () => {
      const organizationName = 'Test Organization';
      const organizationAccountNumber = '12345';
      mountWithPinia({
        organization: {
          organizationId,
          organizationName,
          organizationAccountNumber,
        },
      });
      cy.contains('p', organizationName);
      cy.contains('p', organizationAccountNumber);
    });
  });

  context('User Table Tests', () => {
    it('should render portal user table with contact info', () => {
      mockApiResponses({
        getContacts: { response: [portalUser] },
      });

      mountWithPinia({
        organization: { organizationId, loadedModel: { primaryContactId: '2' } },
        auth: { userInfo: { contactId: userId } },
      });

      cy.wait('@getContacts');
      cy.get('td').contains('div', 'First Name').next('div').should('have.text', portalUser.firstName);
      cy.get('td').contains('div', 'Last Name').next('div').should('have.text', portalUser.lastName);
      cy.get('td').contains('div', 'Phone Number').next('div').should('have.text', portalUser.telephone);
      cy.get('td').contains('div', 'Email').next('div').should('have.text', portalUser.email);
      cy.get('td').contains('div', 'Access Type').next('div').contains('Portal User');
    });

    it('should render `No Role Assigned`', () => {
      mockApiResponses({
        getContacts: { response: [noRoleUser] },
      });

      mountWithPinia({
        organization: { organizationId, loadedModel: { primaryContactId: '2' } },
        auth: { userInfo: { contactId: userId } },
      });

      cy.wait('@getContacts');
      cy.get('td').contains('div', 'Access Type').next('div').contains('No Role Assigned');
    });

    it('should render user table with multiple users', () => {
      const users = [portalUser, noRoleUser, mockUser];

      mockApiResponses({
        getContacts: { response: users },
      });

      mountWithPinia({
        organization: { organizationId, loadedModel: { primaryContactId: '2' } },
        auth: { userInfo: { contactId: userId } },
      });

      cy.wait('@getContacts');
      cy.get('tbody').find('tr').should('have.length', 3);
    });
  });

  context('User Interaction Tests', () => {
    it('should render `Add User` button and open add user dialog on click', () => {
      mountWithPinia({
        organization: { organizationId },
        auth: {
          isAuthenticated: true,
          userInfo: {
            serverTime: new Date(),
          },
          permissions: [PERMISSIONS.ADD_USERS],
        },
      });

      cy.contains('button', 'Add User').click();
      cy.contains('p', 'What type of user are you adding?');
    });

    it('should render `Remove` button and confirm removal', () => {
      mockApiResponses({
        getContacts: { response: [mockUser] },
      });

      mountWithPinia({
        organization: { organizationId, loadedModel: { primaryContactId: '2' } },
        auth: { isAuthenticated: true, userInfo: { contactId: userId }, permissions: [PERMISSIONS.DELETE_USERS] },
      });

      cy.wait('@getContacts');
      cy.contains('button', 'Remove').click();
      cy.contains(`Are you sure you want to remove ${mockUser.firstName} ${mockUser.lastName}`);
    });

    it('should not display `Remove` button for current user', () => {
      mockApiResponses({
        getContacts: { response: [{ contactId: '2', firstName: 'John' }] },
      });

      mountWithPinia({
        organization: { organizationId },
        auth: { userInfo: { contactId: '2' } },
      });

      cy.wait('@getContacts');
      cy.contains('button', 'Remove').should('not.exist');
    });

    it('should render edit button', () => {
      mockApiResponses({
        getContacts: { response: [mockUser] },
      });

      mountWithPinia({
        organization: { organizationId },
        auth: { isAuthenticated: true, userInfo: { contactId: userId }, permissions: [PERMISSIONS.EDIT_USERS] },
      });

      cy.contains('button', 'Edit').click();
      cy.contains('Edit User');
      cy.get('form input').eq(0).should('have.value', mockUser.firstName);
    });

    it('should navigate on clicking Back button', () => {
      mountWithPinia({ organization: { organizationId } });
      cy.contains('button', 'Back').click();
      cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.HOME);
    });
  });

  context('Access Type Tests', () => {
    it('should show `Access Type` as `Contact Only`', () => {
      mockApiResponses({
        getContacts: { response: [{ contactId: '2', firstName: 'John', isPortalUser: false }] },
      });

      mountWithPinia({
        organization: { organizationId },
        auth: { userInfo: { contactId: '2' } },
      });

      cy.wait('@getContacts');
      cy.get('td').contains('div', 'Access Type').next('div').contains('Contact Only');
    });

    it('should render as `Primary Contact`', () => {
      mockApiResponses({
        getContacts: { response: [{ contactId: '2', firstName: 'John', isPortalUser: false }] },
      });

      mountWithPinia({
        organization: {
          organizationId,
          loadedModel: { primaryContactId: '2' },
        },
      });

      cy.wait('@getContacts');
      cy.contains('.v-chip', 'Primary Contact');
    });
  });
});
