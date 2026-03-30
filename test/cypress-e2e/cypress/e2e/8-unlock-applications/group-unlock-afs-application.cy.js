import { APP_TYPE } from "../../support/constants.js";
import { loginPage } from "../../support/pages/1-portal-login-pages/01-portal-login.js";
import { submitApp } from "../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js";

describe("Unlocked PCF Application Submission Test", () => {
  it("Should run through AFS for Group Application, submit and logout", () => {
    loginPage.visitLoginPage();
    loginPage.clickLoginButton();
    loginPage.loginThroughExternalProvider(
      Cypress.env("PORTAL_USERNAME"),
      Cypress.env("PORTAL_PASSWORD"),
    );
    cy.updatePCFApp(APP_TYPE.GROUP_V2);
    cy.runAFS();
    cy.clickNextUntilNotPossible();
    submitApp.summaryAndDeclaration(APP_TYPE.UNLOCKED_APP_RESUBMISSION);
  });
});
