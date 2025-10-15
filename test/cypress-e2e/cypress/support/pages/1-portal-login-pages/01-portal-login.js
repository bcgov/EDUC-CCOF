class LoginPage {
  visitLoginPage() {
    cy.visit('/', { failOnStatusCode: false });
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
  }
}

export const loginPage = new LoginPage();
