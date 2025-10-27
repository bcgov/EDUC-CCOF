import { loginPage } from '../../support/pages/1-portal-login-pages/01-portal-login.js'
import { ccofApp } from '../../support/pages/2-portal-application-pages/01-portal-application-ccof.js'
import { submitApp } from '../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js'


function licenceUpload() {
    ccofApp.loadFixturesAndVariables()
    cy.then(()=>{
        ccofApp.licenceUpload()
    })
}

describe('Group Renewal Application Test', () => {
    it('Should run through Group Renewal Application, submit and logout', () => {
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
            Cypress.env("PORTAL_USERNAME"),
            Cypress.env("PORTAL_PASSWORD"))
        cy.startNewRenewalApp('group')
        licenceUpload()
        cy.runCcfriApp('groupRenewal', '2026-27')
        cy.runEceWeApp('groupRenewal', '2026-27')
        submitApp.summaryAndDeclaration('groupRenewal')
    
    })
    
})