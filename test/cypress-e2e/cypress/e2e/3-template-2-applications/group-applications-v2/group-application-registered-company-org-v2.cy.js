import { APP_TYPE, PROGRAM_YEAR } from "../../../support/constants.js";
import { loginPage } from "../../../support/pages/1-portal-login-pages/01-portal-login.js";
import { submitApp } from "../../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js";

describe("Group Application Test - Registered Comapany", () => {
  it("Should run through Group Application for Registered Company org type, submit and logout", () => {
    loginPage.visitLoginPage();
    loginPage.clickLoginButton();
    loginPage.loginThroughExternalProvider(
      Cypress.env("PORTAL_USERNAME"),
      Cypress.env("PORTAL_PASSWORD"),
    );
    cy.startNewApp(APP_TYPE.GROUP_V2);

    cy.then(() => {
      cy.runCcofApp(APP_TYPE.GROUP_V2);
      cy.runCcfriApp(APP_TYPE.GROUP_V2, PROGRAM_YEAR.CURRENT);
      cy.runEceWeApp(APP_TYPE.GROUP_V2, PROGRAM_YEAR.CURRENT);
      submitApp.summaryAndDeclaration(APP_TYPE.GROUP_V2);
    });
  });
});
