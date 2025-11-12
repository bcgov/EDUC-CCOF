import { loginPage } from '../../support/pages/1-portal-login-pages/01-portal-login.js'
import { submitApp } from '../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js'
import { APPTYPE, PROGRAM_YEAR, LICENCE, ORG_TYPE  } from '../../support/constants.js'

// Ensure each page's information is loaded before running through application
describe('Family Application Test', () => {
    it('Should run through Family Application, submit and logout', () => {
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
            Cypress.env("PORTAL_USERNAME"),
            Cypress.env("PORTAL_PASSWORD"))
        cy.startNewApp(APPTYPE.FAMILY)
    
        cy.then(()=> {
            cy.runCcofApp(APPTYPE.FAMILY, ORG_TYPE.REGISTERED_COMPANY, LICENCE.FAMILY)
            cy.runCcfriApp(APPTYPE.FAMILY, PROGRAM_YEAR.CURRENT)
            cy.runEceWeApp(APPTYPE.FAMILY, PROGRAM_YEAR.CURRENT)
            submitApp.summaryAndDeclaration(APPTYPE.FAMILY)
        })
    })
})