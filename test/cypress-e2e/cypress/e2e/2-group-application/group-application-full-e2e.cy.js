import { loginPage } from '../../support/pages/1-portal-login-pages/01-portal-login.js'
import { ccofApp } from '../../support/pages/2-portal-application-pages/01-portal-application-ccof.js'
import { ccfriApp } from '../../support/pages/2-portal-application-pages/02-portal-application-ccfri.js'
import { eceWeApp } from '../../support/pages/2-portal-application-pages/03-portal-application-ecewe.js'
import { submitApp } from '../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js'

function runCcofApp() {
    ccofApp.loadFixturesAndVariables()
    cy.then(()=>{
        ccofApp.validateGroupUrl('group')
        ccofApp.inputOrganizationInfo()
        ccofApp.inputFacilityInfo()
        ccofApp.licenseAndServiceDeliveryDetails()
        ccofApp.groupLicenses()
        ccofApp.schoolPropertyAndExtendedHours()
        ccofApp.addAnotherFacility()
        ccofApp.licenceUpload()
    })
}

function runCcfriApp() {
    ccfriApp.loadFixturesAndVariables()
    cy.then(()=> {
        ccfriApp.optInFacilities()
        ccfriApp.addClosures()
    })
}

function runEceWeApp() {
    eceWeApp.loadFixturesAndVariables()
    cy.then(()=> {
        eceWeApp.optInEceWe()
        eceWeApp.optInFacilities()
    })
}

describe('Group Application Test', () => {
    it('Full E2E Flow', () => {
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
            Cypress.env("CYPRESS_PORTAL_USERNAME"),
            Cypress.env("CYPRESS_PORTAL_PASSWORD"))
        cy.startNewApp('Group Provider')
    
        cy.then(()=> {
            runCcofApp()
            runCcfriApp()
            runEceWeApp()
            submitApp.summaryAndDeclaration()
        })
    })
    
})