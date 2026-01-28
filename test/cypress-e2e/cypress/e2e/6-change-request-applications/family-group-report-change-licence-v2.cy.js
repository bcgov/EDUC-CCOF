import { loginPage } from "../../support/pages/1-portal-login-pages/01-portal-login.js";
import { submitApp } from "../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js";
import { reportLicenceChange } from "../../support/pages/4-report-changes-licence-service-pages/01-report-changes-licence.js";
import { APP_TYPE, PROGRAM_YEAR } from "../../support/constants.js";

describe("Change Request Report Licence Change Application Test", () => {
  it("Should run through Change Request Report Licence Change Application, submit and logout", () => {
    loginPage.visitLoginPage();
    loginPage.clickLoginButton();
    loginPage.loginThroughExternalProvider(
      Cypress.env("PORTAL_USERNAME"),
      Cypress.env("PORTAL_PASSWORD"),
    );
    cy.startChangeRequest("reportLicenceChange");

    reportLicenceChange.uploadLicenceServiceChange();
    submitApp.summaryAndDeclaration(
      APP_TYPE.FAMILY_CHANGE_REQUEST_V2,
      "ReportOtherChanges",
    );
  });
});
