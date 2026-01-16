import { loginPage } from "../../support/pages/1-portal-login-pages/01-portal-login.js";
import { submitApp } from "../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js";
import { APP_TYPE, PROGRAM_YEAR } from "../../support/constants.js";

describe("Group Change Request Add Facility Application Test", () => {
  it("Should run through Group Change Request Add Facility Application , submit and logout", () => {
    loginPage.visitLoginPage();
    loginPage.clickLoginButton();
    loginPage.loginThroughExternalProvider(
      Cypress.env("PORTAL_USERNAME"),
      Cypress.env("PORTAL_PASSWORD")
    );
    cy.startAddNewFacilityCR();

    cy.then(() => {
      cy.runCcofAppChangeRequest(APP_TYPE.GROUP_V2);
      cy.runCcfriApp(APP_TYPE.GROUP_V2, PROGRAM_YEAR.CURRENT);
      cy.runEceWeAppChangeRequest(APP_TYPE.GROUP_V2, PROGRAM_YEAR.CURRENT);
      submitApp.summaryAndDeclaration(APP_TYPE.GROUP_CHANGE_REQUEST_V2);
    });
  });
});
