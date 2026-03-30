import { APP_TYPE, PROGRAM_YEAR } from "../../../support/constants.js";
import { loginPage } from "../../../support/pages/1-portal-login-pages/01-portal-login.js";
import { submitApp } from "../../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js";

describe("Family Application Test - Sole Proprietorship", () => {
  it("Should run through Family Application for Sole Proprietorship org type, submit and logout", () => {
    loginPage.visitLoginPage();
    loginPage.clickLoginButton();
    loginPage.loginThroughExternalProvider(
      Cypress.env("PORTAL_USERNAME"),
      Cypress.env("PORTAL_PASSWORD"),
    );
    cy.startNewApp(APP_TYPE.FAMILY_V2);

    cy.then(() => {
      cy.runCcofApp(APP_TYPE.FAMILY_V2, "Sole Proprietorship");
      cy.runCcfriApp(APP_TYPE.FAMILY_V2, PROGRAM_YEAR.CURRENT);
      cy.runEceWeApp(APP_TYPE.FAMILY_V2, PROGRAM_YEAR.CURRENT);
      submitApp.summaryAndDeclaration(APP_TYPE.FAMILY_V2);
    });
  });
});
