import { loginPage } from '../../support/pages/1-portal-login-pages/01-portal-login.js'
import { ccofApp } from '../../support/pages/2-portal-application-pages/01-portal-application-ccof.js'
import { ccfriApp } from '../../support/pages/2-portal-application-pages/02-portal-application-ccfri.js'
import { eceWeApp } from '../../support/pages/2-portal-application-pages/03-portal-application-ecewe.js'
import { submitApp } from '../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js'


function licenceUpload() {
    ccofApp.loadFixturesAndVariables()
    cy.then(()=>{
        ccofApp.licenceUpload()
    })
}

function runCcfriApp() {
    ccfriApp.loadFixturesAndVariables()
    cy.then(()=> {
        ccfriApp.optInFacilities()
        ccfriApp.parentFeesRenewal()
        ccfriApp.addParentFees()
        ccfriApp.addClosures('2026-27')
    })
}

function runEceWeApp() {
    eceWeApp.loadFixturesAndVariables()
    cy.then(()=> {
        eceWeApp.optInEceWe('2026-27')
        eceWeApp.groupEceWe()
        eceWeApp.supportingDocUpload()
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
        runCcfriApp()
        runEceWeApp()
        submitApp.summaryAndDeclaration()
    
    })
    
})