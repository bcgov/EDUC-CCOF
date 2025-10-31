import { loginPage } from '../../support/pages/1-portal-login-pages/01-portal-login.js'
import { submitApp } from '../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js'

describe('Family Renewal Application Test', () => {
    it('Should run through Family Renewal Application, submit and logout', () => {
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
            Cypress.env("PORTAL_USERNAME"),
            Cypress.env("PORTAL_PASSWORD"))
        cy.startNewRenewalApp()
        cy.licenceUpload()
        cy.runCcfriApp('familyRenewal', '2026-27')
        cy.runEceWeApp('familyRenewal', '2026-27')
        submitApp.summaryAndDeclaration('familyRenewal')
    
    })
    
})