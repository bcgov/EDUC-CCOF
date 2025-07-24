import { loginPage } from '../../support/pages/LoginPage';

describe('Login Page Test', () => {
  it('should login successfully with valid credentials', () => {
    loginPage.visitLoginPage();
    loginPage.clickLoginButton();
    loginPage.loginThroughExternalProvider(
      Cypress.env('USERNAME'),
      Cypress.env('PASSWORD')
    );
    cy.contains('What would you like to do?').should('exist');
  });
  });
