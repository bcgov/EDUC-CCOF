import AddUserDialog from '@/components/accountMgmt/AddUserDialog.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes } from '@/utils/constants.js';

function mountWithPinia(initialState = {}, dataOverride = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    cy.mount(AddUserDialog, {
      global: {
        plugins: [pinia, vuetify],
      },
      on: {
        'close-add-dialog': cy.spy().as('yourEventSpy'),
      },
      data() {
        return {
          ...dataOverride,
        };
      },
    });
    cy.wrap(pushStub).as('routerPush');
  });
}

describe('<AddUserDialog />', () => {
  beforeEach(() => {
    cy.viewport(1020, 1000);
  });

  context('Step One', () => {
    it('should render step one', () => {
      mountWithPinia({}, { dialog: true });
      cy.contains('p', 'What type of user are you adding?');
    });

    it('should render portal user options', () => {
      mountWithPinia({}, { dialog: true });
      cy.contains('p', 'What level of portal access should this user have?');
    });

    it('should not render admin options for read only portal user', () => {
      mountWithPinia({}, { dialog: true });
      cy.contains('p', 'Which facilities should this user have access to?').should('not.be.visible');
    });

    it('should render cancel button', () => {
      mountWithPinia({}, { dialog: true });
      cy.contains('button', 'Cancel');
    });

    it('should not render back button', () => {
      mountWithPinia({}, { dialog: true });
      cy.contains('button', 'Back').should('not.exist');
    });
  });

  context('Step Two', () => {
    it('should render next button and navigate to step two', () => {
      mountWithPinia({}, { dialog: true });
      cy.contains('button', 'Next').click();
      cy.contains('p', 'What type of user are you adding?').should('not.be.visible');
    });

    it('should disable `Add` button when inputs are blank', () => {
      const userFields = {
        firstName: '',
        lastName: '',
        email: '',
        telephone: '',
        bceid: '',
      };
      mountWithPinia({}, { dialog: true, userFields });
      cy.contains('button', 'Next').click();
      cy.contains('button', 'Add').should('have.css', 'pointer-events', 'none');
    });

    it('should disable `Add` button when some are blank', () => {
      const userFields = {
        firstName: 'John',
        lastName: '',
        email: '',
        telephone: '',
        bceid: '1001',
      };
      mountWithPinia({}, { dialog: true, userFields });
      cy.contains('button', 'Next').click();
      cy.contains('button', 'Add').should('have.css', 'pointer-events', 'none');
    });

    it('should call addUser method when `Add` button is clicked', () => {
      cy.intercept('POST', `${ApiRoutes.CONTACTS}`, {
        statusCode: 200,
      }).as('addUserRequest');

      const userFields = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        telephone: '250-999-9999',
        bceid: '1001',
      };

      mountWithPinia({}, { dialog: true, userFields });

      cy.spy(AddUserDialog.methods, 'addUser').as('addUserSpy');

      cy.contains('button', 'Next').click();
      cy.contains('button', 'Add').click();

      cy.get('@addUserSpy').should('have.been.calledOnce');
      cy.wait('@addUserRequest').its('request').should('have.property', 'method', 'POST');
      cy.contains('p', 'User Added Successfully');
      cy.contains('button', 'Return to Manage Users').click();
      cy.contains('p', 'User Added Successfully').should('not.be.visible');
    });
  });
});
