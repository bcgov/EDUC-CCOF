import { loginPage } from '../../support/pages/1-portal-login-pages/01-portal-login.js'
import { submitApp } from '../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js'

// Ensure each page's information is loaded before running through application
describe('Family Application Test', () => {
    it('Should run through Family Application, submit and logout', () => {
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
            Cypress.env("PORTAL_USERNAME"),
            Cypress.env("PORTAL_PASSWORD"))
        cy.startNewApp('Family Provider')
    
        cy.then(()=> {
            cy.runCcofApp('family', 'registeredCompany', 'familyChildCare')
            cy.runCcfriApp('family')
            cy.runEceWeApp('family')
            submitApp.summaryAndDeclaration()
        })
    })
})