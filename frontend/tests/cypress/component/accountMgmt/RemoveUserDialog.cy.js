import RemoveUserDialog from '@/components/accountMgmt/RemoveUserDialog.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes } from '@/utils/constants.js';

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

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    const onRemoveDialog = cy.spy().as('closeRemoveDialogSpy');
    const onContactDeactivated = cy.spy().as('contactDeactivated');

    cy.mount(RemoveUserDialog, {
      global: {
        plugins: [pinia, vuetify],
      },
      data() {
        return {
          dialogOpen: true,
        };
      },
      attrs: {
        'onClose-remove-dialog': onRemoveDialog,
        'onContact-deactivated': onContactDeactivated,
      },
      props: {
        user: mockUser,
      },
    });
    cy.wrap(pushStub).as('routerPush');
  });
}

describe('<RemoveUserDialog />', () => {
  beforeEach(() => {
    cy.viewport(1200, 1200);
  });

  it('should render remove user dialog', () => {
    mountWithPinia();
    cy.contains('Remove User');
    cy.contains(`Are you sure you want to remove ${mockUser.firstName} ${mockUser.lastName}? You can't undo this.`);
  });

  it('should cancel removal of user', () => {
    mountWithPinia();
    cy.contains('button', 'Cancel').click();
    cy.get('@closeRemoveDialogSpy').should('have.been.calledOnce');
  });

  it('should delete user', () => {
    cy.intercept('DELETE', `${ApiRoutes.CONTACTS}/${mockUser.contactId}`, {
      statusCode: 204,
    });

    mountWithPinia();
    cy.contains('button', 'Yes, remove the user').click();
    cy.get('@contactDeactivated').should('have.been.calledOnce');
    cy.get('@closeRemoveDialogSpy').should('have.been.calledOnce');
  });
});
