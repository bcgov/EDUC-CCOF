import { submitApp } from '../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js'
import { loginPage } from "../../support/pages/1-portal-login-pages/01-portal-login";
import { APPTYPE, PROGRAM_YEAR, LICENCE, ORG_TYPE  } from '../../support/constants.js'

describe('Group Application Test Template 1', () => {
    it('Should run through Template 1 Group Application, submit and logout', () => {
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
            Cypress.env("PORTAL_USERNAME"),
            Cypress.env("PORTAL_PASSWORD"))
        cy.startNewApp(APPTYPE.GROUP)
    
        cy.then(()=> {
            cy.runCcofAppOld(APPTYPE.GROUP, ORG_TYPE.REGISTERED_COMPANY, LICENCE.GROUP)
            // cy.runCcfriAppOld(APPTYPE.GROUP, PROGRAM_YEAR.CURRENT)
            // cy.runEceWeAppOld(APPTYPE.GROUP, PROGRAM_YEAR.CURRENT)
            // submitApp.summaryAndDeclarationOld(APPTYPE.GROUP)
        })
    })
    
})