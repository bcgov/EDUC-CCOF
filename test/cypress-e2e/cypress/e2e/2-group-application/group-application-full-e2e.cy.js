import { submitApp } from '../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js'
import { loginPage } from "../../support/pages/1-portal-login-pages/01-portal-login";

describe('Group Application Test', () => {
    it('Should run through Group Application, submit and logout', () => {
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
            Cypress.env("PORTAL_USERNAME"),
            Cypress.env("PORTAL_PASSWORD"))
        cy.startNewApp('Group Provider')
    
        cy.then(()=> {
            cy.runCcofApp('group', 'registeredCompany', 'groupLicenceCategories')
            cy.runCcfriApp('group')
            cy.runEceWeApp('group')
            submitApp.summaryAndDeclaration()
        })
    })
    
})