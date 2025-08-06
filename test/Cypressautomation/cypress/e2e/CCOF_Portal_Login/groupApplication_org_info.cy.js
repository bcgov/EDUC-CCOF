import { loginPage } from '../../support/pages/LoginPage';

describe('Group Application', () => {

  // This hook runs before each test case
  beforeEach(() => {
    loginPage.visitLoginPage();
    loginPage.clickLoginButton();
    loginPage.loginThroughExternalProvider(
      Cypress.env('USERNAME'),
      Cypress.env('PASSWORD')
    );

    // Confirm login was successful
    cy.contains('What would you like to do?').should('exist');

     cy.wait(10000); // Give DOM a moment to render
  cy.document().then((doc) => {
    const cancelBtn = Array.from(doc.querySelectorAll('button')).find(
      (el) => el.textContent.trim() === 'Cancel Application'
    );

    if (cancelBtn) {
      // Click Cancel Application
      cy.wrap(cancelBtn).click({ force: true });

      // Wait for popup and confirm cancellation
      cy.get('#cancel-application-button > .v-btn__content > .text-wrap', { timeout: 5000 })
        .should('be.visible')
        .click({ force: true });

      // Optionally confirm we’re back at home state
      cy.contains('What would you like to do?').should('exist');
    }
  });

  });

  it('should navigate and verify pages after login', () => {
    cy.contains('button', 'Start Application').click();

    cy.contains('p', 'Welcome to Child Care Operating Funding (CCOF)').should('exist');
    cy.get('#start-application').should('be.visible').click();

    cy.contains('p', 'Welcome to Child Care Operating Funding (CCOF)').should('exist');
    cy.contains('div.v-card-title', 'Group Provider').should('exist');
    cy.contains('button', 'Start Application').click();
    // Verify the org info page
    cy.get('.v-card-title > h3').should('contain', 'Organization Information');
    cy.get('#input-46').click();
    cy.get('#input-55').clear().type('Automation Test Organisation');
    cy.get('#input-58').clear().type('BC654321');
    cy.get('#checkbox-61').click();
    cy.get('#input-90').clear().type('506 John Street');
    cy.get('#input-67').clear().type('Vancouver');
    cy.get('.mdi-menu-down').first().click();
    cy.get('.v-overlay-container .v-list-item').contains('BC').click();
    cy.get('#input-72').clear().type('V5C6N5');
    cy.get('#input-77').click();
    cy.get('#input-80').clear().type('Tester');
    cy.get('#input-82').clear().type('QA');
    cy.get('#input-84').clear().type('6470000000');
    cy.get('#input-88').clear().type('ofmqa01@gmail.com');
    cy.get('.justify-space-around > :nth-child(3) > .v-btn__content').click();
    cy.get('.justify-space-around > :nth-child(2) > .v-btn__content').click();

  });
});