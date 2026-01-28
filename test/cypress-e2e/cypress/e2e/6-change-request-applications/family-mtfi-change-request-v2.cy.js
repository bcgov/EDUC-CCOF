import { loginPage } from "../../support/pages/1-portal-login-pages/01-portal-login.js";
import { submitApp } from "../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js";
import { APP_TYPE } from "../../support/constants.js";
import { reportMtfiChange } from "../../support/pages/5-mid-term-fee-increase-mtfi-pages/01-mid-term-fee-increase.js";

describe("Family MTFI Change Request Application Test", () => {
  it("Should run through Family MTFI Change Request Application, submit and logout", () => {
    loginPage.visitLoginPage();
    loginPage.clickLoginButton();
    loginPage.loginThroughExternalProvider(
      Cypress.env("PORTAL_USERNAME"),
      Cypress.env("PORTAL_PASSWORD"),
    );
    cy.startChangeRequest("mtfi");

    cy.then(() => {
      cy.runMtfiChangeRequest(APP_TYPE.FAMILY_V2, "ccfriData.json");
      submitApp.summaryAndDeclaration(
        APP_TYPE.FAMILY_CHANGE_REQUEST_V2,
        "MidTermFeeIncrease",
      );
    });
  });
});
