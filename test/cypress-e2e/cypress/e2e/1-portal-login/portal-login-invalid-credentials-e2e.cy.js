import { loginPage } from "../../support/pages/1-portal-login-pages/01-portal-login";

describe("Login Page Test", () => {
  it("should login successfully with valid credentials", () => {
    loginPage.visitLoginPage();
    loginPage.clickLoginButton();
    loginPage.loginThroughExternalProvider(
      Cypress.env("PORTAL_USERNAME"),
      Cypress.env("PORTAL_PASSWORD")
    );
    cy.contains("What would you like to do?").should("exist");
    // apply application card check
    cy.get(".pb-2 > p").should("exist");
  });

  it("failed login", () => {
    // Ignore known SSO errors so the test continues
    cy.on("uncaught:exception", () => false);

    // Go to login page and start login
    loginPage.visitLoginPage();
    loginPage.clickLoginButton();

    // Hardcoded test credentials
    const TEST_USERNAME = "my-test-user";
    const TEST_PASSWORD = " ";

    // Attempt login via SSO provider
    loginPage.loginThroughExternalProvider(TEST_USERNAME, TEST_PASSWORD);

    // Assertions that target the SSO page DOM
    cy.origin("https://logontest7.gov.bc.ca", () => {
      // (optional) suppress SSO-side script errors if they’re noisy
      cy.on("uncaught:exception", () => false);

      cy.get("#user", { timeout: 10000 }).should("exist");
      cy.get(".pb-2 > p").should("not.exist");
    });
  });
});
