import { APP_TYPE, PROGRAM_YEAR } from "../../../support/constants.js";
import { loginPage } from "../../../support/pages/1-portal-login-pages/01-portal-login.js";
import { submitApp } from "../../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js";

describe("Group Application Test - Non-Profit Society", () => {
  it("Should run through Group Application for Non-Profit Society org type, submit and logout", () => {
    loginPage.visitLoginPage();
    loginPage.clickLoginButton();
    loginPage.loginThroughExternalProvider(
      Cypress.env("PORTAL_USERNAME"),
      Cypress.env("PORTAL_PASSWORD"),
    );
    cy.startNewApp(APP_TYPE.GROUP_V2);

    cy.then(() => {
      cy.runCcofApp(APP_TYPE.GROUP_V2, "Non-Profit Society");
      cy.runCcfriApp(APP_TYPE.GROUP_V2, PROGRAM_YEAR.CURRENT);
      cy.runEceWeApp(APP_TYPE.GROUP_V2, PROGRAM_YEAR.CURRENT);
      submitApp.summaryAndDeclaration(APP_TYPE.GROUP_V2);
    });
  });
});
