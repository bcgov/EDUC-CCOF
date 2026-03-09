import { APP_TYPE, PROGRAM_YEAR } from '../../support/constants.js'
import { loginPage } from "../../support/pages/1-portal-login-pages/01-portal-login.js";
import { submitApp } from '../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js'

describe('Unlocked PCF Application Submission Test', () => {
    it('Should run through unlocked Group Application, submit and logout', () => {
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
            Cypress.env("PORTAL_USERNAME"),
            Cypress.env("PORTAL_PASSWORD"))
        cy.updatePCFApp(APP_TYPE.GROUP_V2)
        cy.then(()=> {
            cy.clickByText('Next')
            cy.clickByText('No')
            cy.clickByText('Next')
            cy.clickByText('Update')
            cy.clickByText('Next')
            cy.clickByText('Next')
            cy.runRFI()
            cy.runNMF()
            cy.clickByText('Next')
            cy.runEceWeApp(APP_TYPE.GROUP_V2, PROGRAM_YEAR.FUTURE)

            submitApp.summaryAndDeclaration(APP_TYPE.GROUP_V2)
            //cy.runCcfriApp(APP_TYPE.GROUP_V2, PROGRAM_YEAR.FUTURE)

        })
        
    })
})