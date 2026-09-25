import AddUserDialog from '@/components/accountMgmt/AddUserDialog.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes } from '@/utils/constants.js';

const ORGANIZATION_ID = '1234';
const CONTACT_ID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

function getFilledUserFields() {
  return {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    telephone: '250-999-9999',
    bceid: '1001',
  };
}

const orphanedResponse = {
  exists: true,
  orphaned: true,
  contactId: CONTACT_ID,
  firstName: 'John',
  lastName: 'Doe',
  message: 'This BCeID exists but is not associated with any organization.',
};

const orphanedDeactivatedResponse = {
  ...orphanedResponse,
  deactivated: true,
};

function mountWithPinia(initialState = {}, dataOverride = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    cy.mount(AddUserDialog, {
      global: {
        plugins: [pinia, vuetify],
      },
      data() {
        return {
          ...dataOverride,
        };
      },
    });
    cy.wrap(pushStub).as('routerPush');
    cy.wrap(pinia).as('pinia');
  });
}

function goToStepTwoAndSubmit(userFields = getFilledUserFields()) {
  mountWithPinia({ organization: { organizationId: ORGANIZATION_ID } }, { dialog: true, userFields });
  cy.contains('button', 'Next').click();
  cy.contains('button', 'Add').click();
}

function expectFailureAlert(expectedText) {
  cy.get('@pinia').then((pinia) => {
    const queue = pinia.state.value.app.alertNotificationQueue;
    const found = queue.some((alert) => alert.text === expectedText);
    expect(found, `expected failure alert "${expectedText}" in queue: ${JSON.stringify(queue)}`).to.be.true;
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
        statusCode: 201,
      }).as('addUserRequest');

      const userFields = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        telephone: '250-999-9999',
        bceid: '1001',
      };

      mountWithPinia({ organization: { organizationId: ORGANIZATION_ID } }, { dialog: true, userFields });

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

  context('CCFRI-8237 - existing BCeID handling', () => {
    it('shows success dialog when a brand new BCeID is created', () => {
      cy.intercept('POST', `${ApiRoutes.CONTACTS}`, {
        statusCode: 201,
        body: { contactid: CONTACT_ID },
      }).as('addUserRequest');

      goToStepTwoAndSubmit();

      cy.wait('@addUserRequest');
      cy.contains('p', 'User Added Successfully').should('be.visible');
    });

    it('shows link confirmation dialog when BCeID exists without an organization', () => {
      cy.intercept('POST', `${ApiRoutes.CONTACTS}`, {
        statusCode: 200,
        body: orphanedResponse,
      }).as('addUserRequest');

      goToStepTwoAndSubmit();

      cy.wait('@addUserRequest');
      cy.contains('Link Existing BCeID').should('be.visible');
      cy.contains('This BCeID exists but is not associated with any organization.').should('be.visible');
      cy.contains('This account is currently deactivated and will be reactivated when linked.').should('not.exist');
      cy.contains('Would you like to link').should('be.visible');
      cy.contains('button', 'Link User').should('be.visible');
      cy.contains('p', 'User Added Successfully').should('not.exist');
    });

    it('links the orphaned BCeID when the admin confirms', () => {
      cy.intercept('POST', `${ApiRoutes.CONTACTS}`, {
        statusCode: 200,
        body: orphanedResponse,
      }).as('addUserRequest');
      cy.intercept('POST', `${ApiRoutes.CONTACTS}/linkcontactwithanorg`, {
        statusCode: 200,
        body: { contactId: CONTACT_ID, organizationId: ORGANIZATION_ID },
      }).as('linkRequest');

      goToStepTwoAndSubmit();
      cy.wait('@addUserRequest');
      cy.contains('button', 'Link User').click();

      cy.wait('@linkRequest').then(({ request }) => {
        expect(request.body.contactId).to.eq(CONTACT_ID);
        expect(request.body.organizationId).to.eq(ORGANIZATION_ID);
      });
      cy.contains('Link Existing BCeID').should('not.be.visible');
      cy.contains('p', 'User Added Successfully').should('be.visible');
    });

    it('keeps the add dialog open and does not call link when the admin cancels', () => {
      cy.intercept('POST', `${ApiRoutes.CONTACTS}`, {
        statusCode: 200,
        body: orphanedResponse,
      }).as('addUserRequest');
      cy.intercept('POST', `${ApiRoutes.CONTACTS}/linkcontactwithanorg`, {
        statusCode: 200,
        body: { contactId: CONTACT_ID, organizationId: ORGANIZATION_ID },
      }).as('linkRequest');

      goToStepTwoAndSubmit();
      cy.wait('@addUserRequest');
      cy.contains('.v-card', 'Link Existing BCeID').within(() => {
        cy.contains('button', 'Cancel').click();
      });

      cy.contains('Link Existing BCeID').should('not.be.visible');
      cy.contains('Add New User').should('be.visible');
      cy.get('@linkRequest.all').should('have.length', 0);
      cy.contains('p', 'User Added Successfully').should('not.exist');
    });

    it('shows a meaningful error when the BCeID already belongs to another organization', () => {
      const message = 'This BCeID is already associated with another organization.';
      cy.intercept('POST', `${ApiRoutes.CONTACTS}`, {
        statusCode: 412,
        body: { message, contactId: CONTACT_ID, organizationId: '99999999-9999-9999-9999-999999999999' },
      }).as('addUserRequest');

      goToStepTwoAndSubmit();

      cy.wait('@addUserRequest');
      expectFailureAlert(message);
      cy.contains('p', 'User Added Successfully').should('not.exist');
      cy.contains('Link Existing BCeID').should('not.exist');
    });

    it('shows a failure alert when the link request fails', () => {
      cy.intercept('POST', `${ApiRoutes.CONTACTS}`, {
        statusCode: 200,
        body: orphanedResponse,
      }).as('addUserRequest');
      cy.intercept('POST', `${ApiRoutes.CONTACTS}/linkcontactwithanorg`, {
        statusCode: 500,
        body: { message: 'Internal Server Error' },
      }).as('linkRequest');

      goToStepTwoAndSubmit();
      cy.wait('@addUserRequest');
      cy.contains('button', 'Link User').click();

      cy.wait('@linkRequest');
      expectFailureAlert('Failed to Link User');
      cy.contains('p', 'User Added Successfully').should('not.exist');
    });

    it('shows the backend message when the link request returns 412', () => {
      const message = 'This BCeID is already associated with another organization.';
      cy.intercept('POST', `${ApiRoutes.CONTACTS}`, {
        statusCode: 200,
        body: orphanedResponse,
      }).as('addUserRequest');
      cy.intercept('POST', `${ApiRoutes.CONTACTS}/linkcontactwithanorg`, {
        statusCode: 412,
        body: { message, contactId: CONTACT_ID },
      }).as('linkRequest');

      goToStepTwoAndSubmit();
      cy.wait('@addUserRequest');
      cy.contains('button', 'Link User').click();

      cy.wait('@linkRequest');
      expectFailureAlert(message);
      cy.contains('p', 'User Added Successfully').should('not.exist');
    });

    it('shows a reactivation notice when the orphaned BCeID is deactivated', () => {
      cy.intercept('POST', `${ApiRoutes.CONTACTS}`, {
        statusCode: 200,
        body: orphanedDeactivatedResponse,
      }).as('addUserRequest');

      goToStepTwoAndSubmit();

      cy.wait('@addUserRequest');
      cy.contains('Link Existing BCeID').should('be.visible');
      cy.contains('This account is currently deactivated and will be reactivated when linked.').should('be.visible');
    });
  });
});
