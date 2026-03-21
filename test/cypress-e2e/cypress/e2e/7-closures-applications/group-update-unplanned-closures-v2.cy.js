import { loginPage } from "../../support/pages/1-portal-login-pages/01-portal-login.js";
import { organizationClosure } from "../../support/pages/6-organization-closures-pages/01-unplanned-closure.js";

describe("Group Unplanned Closure Update Test", () => {
  it("Should run through Group Unplanned Closure update request flow", () => {
    loginPage.visitLoginPage();
    loginPage.clickLoginButton();
    loginPage.loginThroughExternalProvider(
      Cypress.env("PORTAL_USERNAME"),
      Cypress.env("PORTAL_PASSWORD"),
    );
    cy.startOrganizationClosures();

    organizationClosure
      .loadFixturesAndVariables("update-closureData.json")
      .then(() => {
        organizationClosure.updateClosureRequest();
      });
  });
});
