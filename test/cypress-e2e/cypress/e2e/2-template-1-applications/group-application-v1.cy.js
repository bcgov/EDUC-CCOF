import { submitApp } from '../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js'
import { loginPage } from "../../support/pages/1-portal-login-pages/01-portal-login.js";
import { APP_TYPE, PROGRAM_YEAR, LICENCE_TYPE, ORG_TYPE, FUNDING_MODEL  } from '../../support/constants.js'

describe('Group Application Test Template 1', () => {
    it('Should run through Template 1 Group Application, submit and logout', () => {
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
            Cypress.env("PORTAL_USERNAME"),
            Cypress.env("PORTAL_PASSWORD"))
        cy.startNewApp(APP_TYPE.GROUP_V1)
    
        cy.then(()=> {
            cy.runCcofApp(APP_TYPE.GROUP_V1, ORG_TYPE.REGISTERED_COMPANY, LICENCE_TYPE.GROUP_V1)
            cy.runCcfriApp(APP_TYPE.GROUP_V1, PROGRAM_YEAR.CURRENT)
            cy.runEceWeApp(APP_TYPE.GROUP_V1, PROGRAM_YEAR.CURRENT, {model: FUNDING_MODEL.PROVINCIALLY_FUNDED})
            submitApp.summaryAndDeclaration(APP_TYPE.GROUP_V1)
        })
    })
    
})