import { loginPage } from "../../support/pages/1-portal-login-pages/01-portal-login.js";
import { organizationClosure } from "../../support/pages/6-organization-closures-pages/01-add-new-closure.js";
import { APP_TYPE } from "../../support/constants.js";

describe("Group Unplanned Closure Application Test", () => {
  it("Should run through Group Unplanned Closure, submit , validate pending status and logout", () => {
    loginPage.visitLoginPage();
    loginPage.clickLoginButton();
    loginPage.loginThroughExternalProvider(
      Cypress.env("PORTAL_USERNAME"),
      Cypress.env("PORTAL_PASSWORD"),
    );
    cy.startOrganizationClosures();

    organizationClosure
      .loadFixturesAndVariables("closureData.json")
      .then(() => {
        organizationClosure.createNewClosure();
      });
  });
});
