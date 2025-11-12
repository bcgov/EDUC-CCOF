import { loginPage } from '../../support/pages/1-portal-login-pages/01-portal-login.js'
import { submitApp } from '../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js'
import { APPTYPE, PROGRAM_YEAR  } from '../../support/constants.js'

describe('Group Renewal Application Test', () => {
    it('Should run through Group Renewal Application, submit and logout', () => {
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
            Cypress.env("PORTAL_USERNAME"),
            Cypress.env("PORTAL_PASSWORD"))
        cy.startNewRenewalApp()
        cy.licenceUpload()
        cy.runCcfriApp(APPTYPE.GROUP_RENEWAL, PROGRAM_YEAR.FUTURE)
        cy.runEceWeApp(APPTYPE.GROUP_RENEWAL, PROGRAM_YEAR.FUTURE)
        submitApp.summaryAndDeclaration(APPTYPE.GROUP_RENEWAL)
    })
    
})