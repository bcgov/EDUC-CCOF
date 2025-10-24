class LoginPage {
  visitLoginPage() {
    cy.visit('/');
  }

  clickLoginButton() {
    cy.get("#login-button").click();
  }

  loginThroughExternalProvider(
    username,
    password,
    { suppressErrors = true } = {}
  ) {
    // Portal-side: ignore app errors if desired
    if (suppressErrors) cy.on("uncaught:exception", () => false);

    cy.origin(
      "https://logontest7.gov.bc.ca",
      { args: { username, password, suppressErrors } },
      ({ username, password, suppressErrors }) => {
        // SSO-side: you must attach the handler again inside the origin
        if (suppressErrors) cy.on("uncaught:exception", () => false);

        cy.get("#user").clear().type(username);
        cy.get("#password").clear().type(password, { log: false });
        cy.get('input[type="submit"][value="Continue"]').click();
      }
    );

    // Refresh home page once loaded, after cy.origin(), to reset url cypress uses for testing
    cy.contains("What would you like to do?").should("exist");
    cy.visit('/')
  }
}

export const loginPage = new LoginPage();
