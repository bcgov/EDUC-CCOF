import { loginPage } from "../../support/pages/1-portal-login-pages/01-portal-login";

describe("Portal Login and Navigation", () => {
  it("should navigate and verify pages after login", () => {
    loginPage.visitLoginPage();
    loginPage.clickLoginButton();
    loginPage.loginThroughExternalProvider(
      Cypress.env("PORTAL_USERNAME"),
      Cypress.env("PORTAL_PASSWORD")
    );
    cy.contains("button", "Start Application").click({force: true});
    cy.contains("p", "Welcome to Child Care Operating Funding (CCOF)").should(
      "exist"
    );
    cy.get("#start-application").should("be.visible").click({force: true});
    cy.contains("p", "Welcome to Child Care Operating Funding (CCOF)").should(
      "exist"
    );
    cy.contains("div.v-card-title", "Group Provider").should("exist");
    cy.contains("button", "Start Application").click();
    });
});
