import { submitApp } from '../../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js'
import { loginPage } from "../../../support/pages/1-portal-login-pages/01-portal-login.js";
import { APP_TYPE, PROGRAM_YEAR} from '../../../support/constants.js'

describe('Group Application Test Template 2', () => {
    it('Should run through Template 2 Group Application with multiple facilities, submit and logout', () => {
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
            Cypress.env("PORTAL_USERNAME"),
            Cypress.env("PORTAL_PASSWORD"))
        cy.startNewApp(APP_TYPE.GROUP_V2)

        // Currently Template 2 uses "Future" program year
        // On 2/15/2026 update "Current" year in Constants to 2026-27 and update parameter here to "PROGRAM_YEAR.CURRENT"
        cy.task('countFiles', 'cypress/fixtures/ccof-data/extra-facs-ccof').then((files)=> {
            cy.runCcofApp(APP_TYPE.GROUP_V2, "Registered Company", files)
        })

        cy.task('countFiles', 'cypress/fixtures/extra-facs-ccfri').then((files) => {
            cy.runCcfriApp(APP_TYPE.GROUP_V2, PROGRAM_YEAR.CURRENT, files)
        })

        cy.task('countFiles', 'cypress/fixtures/ecewe-data/extra-facs-ecewe').then((files)=> {
            cy.runEceWeApp(APP_TYPE.GROUP_V2, PROGRAM_YEAR.CURRENT, files)
            submitApp.summaryAndDeclaration(APP_TYPE.GROUP_V2)
        })
    })

})
