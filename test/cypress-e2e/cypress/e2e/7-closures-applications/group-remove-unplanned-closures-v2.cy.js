import { loginPage } from "../../support/pages/1-portal-login-pages/01-portal-login.js";
import { organizationClosure } from "../../support/pages/6-organization-closures-pages/01-unplanned-closure.js";

describe("Group Unplanned Closure Remove Test", () => {
  it("Should run through Group Unplanned Closure remove request flow", () => {
    loginPage.visitLoginPage();
    loginPage.clickLoginButton();
    loginPage.loginThroughExternalProvider(
      Cypress.env("PORTAL_USERNAME"),
      Cypress.env("PORTAL_PASSWORD"),
    );
    cy.startOrganizationClosures();

    organizationClosure
      .loadFixturesAndVariables("remove-closureData.json")
      .then(() => {
        organizationClosure.removeClosureRequest();
      });
  });
});
