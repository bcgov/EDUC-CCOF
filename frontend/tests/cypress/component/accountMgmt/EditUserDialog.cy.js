import EditUserDialog from '@/components/accountMgmt/EditUserDialog.vue';
import vuetify from '@/plugins/vuetify';
import { useAuthStore } from '@/store/auth';
import { ApiRoutes, ROLES } from '@/utils/constants.js';
import { PERMISSIONS } from '@/utils/constants/permissions.js';

const organizationId = '1234';
const mockUser = {
  contactId: 123,
  firstName: 'Test',
  lastName: 'User',
  bceid: 'testuser',
  email: 'test@example.com',
  telephone: '123-456-7890',
  role: { roleNumber: 1 },
  facilities: [],
};
const adminUser = {
  contactId: 123,
  firstName: 'Test',
  lastName: 'User',
  bceid: 'testuser',
  email: 'test@example.com',
  telephone: '123-456-7890',
  role: { roleNumber: ROLES.FAC_ADMIN_ADVANCED },
  facilities: [],
};
const facilityResponse = [
  {
    facilityName: 'Test-Facility1',
    facilityId: '777',
  },
  {
    facilityName: 'Test-Facility2',
    facilityId: '888',
  },
  {
    facilityName: 'Test-Facility3',
    facilityId: '999',
  },
];

function mountWithPinia(user, initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    const onContactUpdated = cy.spy().as('contactUpdatedSpy');
    const onCloseEditDialog = cy.spy().as('closeEditDialogSpy');

    cy.mount(EditUserDialog, {
      global: {
        plugins: [pinia, vuetify],
      },
      data() {
        return {
          dialogOpen: true,
        };
      },
      attrs: {
        'onContact-updated': onContactUpdated,
        'onClose-edit-dialog': onCloseEditDialog,
      },
      props: {
        user: user ?? mockUser,
      },
    }).then(({ component }) => {
      component.loadEditUserData();
    });

    cy.wrap(pushStub).as('routerPush');
  });
}

describe('<EditUserDialog />', () => {
  beforeEach(() => {
    globalThis.localStorage.setItem('jwtToken', 'mocked-jwt-token');
    cy.viewport(1200, 1500);
  });

  afterEach(() => {
    globalThis.localStorage.removeItem('jwtToken');
  });

  it('should mount the dialog and display inputs for user without edit permissions', () => {
    mountWithPinia();
    cy.contains('h3', 'Edit User');

    cy.get('form input').should('have.length', 5);

    cy.get('form input').eq(0).prev('label').should('have.text', 'First Name');
    cy.get('form input').eq(1).prev('label').should('have.text', 'Last Name');
    cy.get('form input').eq(2).prev('label').should('have.text', 'Business BCeID');
    cy.get('form input').eq(3).prev('label').should('have.text', 'Phone Number');
    cy.get('form input').eq(4).prev('label').should('have.text', 'Email Address');
  });

  it('should load the users prior data', () => {
    mountWithPinia();
    cy.get('form input').eq(0).should('have.value', mockUser.firstName);
    cy.get('form input').eq(1).should('have.value', mockUser.lastName);
    cy.get('form input').eq(2).should('have.value', mockUser.bceid).shou;
    cy.get('form input').eq(3).should('have.value', mockUser.telephone);
    cy.get('form input').eq(4).should('have.value', mockUser.email);
  });

  it('should disable bceid input', () => {
    mountWithPinia();
    cy.get('form input').eq(2).should('have.value', mockUser.bceid).should('have.css', 'pointer-events', 'none');
  });

  it('should render user role input for users with edit permission', () => {
    mountWithPinia(null, {
      auth: {
        isAuthenticated: true,
        userInfo: {
          serverTime: new Date(),
        },
      },
    });

    cy.then(() => {
      const authStore = useAuthStore();
      authStore.permissions = [PERMISSIONS.EDIT_USERS];
    });

    cy.contains('label', 'User Role');
    cy.get('form input').eq(5).should('have.value', mockUser.role.roleNumber);
  });

  it('should render facilities options', () => {
    cy.intercept('GET', `${ApiRoutes.ORGANIZATION}/${organizationId}/facilities`, {
      statusCode: 200,
      body: facilityResponse,
    });

    mountWithPinia(adminUser, {
      auth: {
        isAuthenticated: true,
        userInfo: {
          serverTime: new Date(),
        },
      },
      organization: {
        organizationId,
      },
    });

    cy.then(() => {
      const authStore = useAuthStore();
      authStore.permissions = [PERMISSIONS.EDIT_USERS];
    });

    cy.contains('label', 'Facilities');
  });

  it('should update user on clicking `Update` button', () => {
    cy.intercept('PATCH', `${ApiRoutes.CONTACTS}/${mockUser.contactId}`, {
      statusCode: 200,
      body: {},
    });

    mountWithPinia();

    cy.contains('button', 'Update').click();
    cy.get('@contactUpdatedSpy').should('have.been.calledOnce');
  });

  it('should disable `Update` button when inputs are empty', () => {
    mountWithPinia({}, { firstName: 'John' });
    cy.contains('button', 'Update').should('have.css', 'pointer-events', 'none');
  });

  it('should close dialog', () => {
    mountWithPinia();
    cy.contains('button', 'Cancel').click();
    cy.contains('Edit User').should('not.be.visible');
    cy.get('@closeEditDialogSpy').should('have.been.calledOnce');
  });
});
