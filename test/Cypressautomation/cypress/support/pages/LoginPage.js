class LoginPage {
  visitLoginPage() {
    cy.visit('/login');
  }

  clickLoginButton() {
    cy.get('#login-button').click();
  }

 loginThroughExternalProvider(username, password) {
  cy.origin(
    'https://logontest7.gov.bc.ca',
    { args: { username, password } },
    ({ username, password }) => {
      cy.get('#user').clear().type(username);
      cy.get('#password').clear().type(password, { log: false });
      cy.get('input[type="submit"][value="Continue"]').click();
    }
  );
}
}
export const loginPage = new LoginPage();
