import { loginPage } from "../../support/pages/1-portal-login-pages/01-portal-login";
import { APP_TYPE } from '../../support/constants.js'

describe("Portal Login and Navigation", () => {
  it("should navigate and verify pages after login", () => {
    loginPage.visitLoginPage();
    loginPage.clickLoginButton();
    loginPage.loginThroughExternalProvider(
      Cypress.env("PORTAL_USERNAME"),
      Cypress.env("PORTAL_PASSWORD")
    );
    cy.startNewApp(APP_TYPE.GROUP_V1)
  })
});
