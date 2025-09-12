import { loginPage } from '../../support/pages/LoginPage';

describe('Portal Login and Navigation', () => {

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
  });
  it('should navigate and verify pages after login', () => {
    // Now perform navigation steps after login
    cy.contains('button', 'Start Application').click();
    cy.contains('p', 'Welcome to Child Care Operating Funding (CCOF)').should('exist');
    cy.get('#start-application').should('be.visible').click();
    cy.contains('p', 'Welcome to Child Care Operating Funding (CCOF)').should('exist');
    cy.contains('div.v-card-title', 'Group Provider').should('exist');
    cy.contains('button', 'Start Application').click();
  });
});
// Add afterEach hook to log out after each test for isolation
/*afterEach(() => {
  // Assuming there is a logout button or link available after login
  cy.contains('button', 'Logout').click({ force: true });
  cy.contains('Sign in').should('exist');
});**/