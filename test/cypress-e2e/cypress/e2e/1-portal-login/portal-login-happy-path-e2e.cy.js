import { loginPage } from "../../support/pages/1-portal-login-pages/01-portal-login";

describe("Portal Login and Navigation", () => {
  // This hook runs before each test case
  beforeEach(() => {
    loginPage.visitLoginPage();
    loginPage.clickLoginButton();
    loginPage.loginThroughExternalProvider(
      Cypress.env("CYPRESS_PORTAL_USERNAME"),
      Cypress.env("CYPRESS_PORTAL_PASSWORD")
    );
    // Confirm login was successful
    cy.contains("What would you like to do?").should("exist");
  });
  it("should navigate and verify pages after login", () => {
    // Now perform navigation steps after login
    cy.contains("button", "Start Application").click();
    cy.contains("p", "Welcome to Child Care Operating Funding (CCOF)").should(
      "exist"
    );
    cy.get("#start-application").should("be.visible").click();
    cy.contains("p", "Welcome to Child Care Operating Funding (CCOF)").should(
      "exist"
    );
    cy.contains("div.v-card-title", "Group Provider").should("exist");
    cy.contains("button", "Start Application").click();
  });
});
