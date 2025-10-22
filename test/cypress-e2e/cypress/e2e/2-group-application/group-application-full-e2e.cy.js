import { loginPage } from '../../support/pages/1-portal-login-pages/01-portal-login.js'
import { ccofApp } from '../../support/pages/2-portal-application-pages/01-portal-application-ccof.js'
import { ccfriApp } from '../../support/pages/2-portal-application-pages/02-portal-application-ccfri.js'
import { eceWeApp } from '../../support/pages/2-portal-application-pages/03-portal-application-ecewe.js'
import { submitApp } from '../../support/pages/2-portal-application-pages/04-portal-application-summary-declaration.js'

// Ensure each page's information is loaded before running through application
function runCcofApp() {
    ccofApp.loadFixturesAndVariables()
    cy.then(()=>{
        ccofApp.validateGroupUrl('group')
        ccofApp.inputOrganizationInfo()
        ccofApp.inputFacilityInfo()
        ccofApp.licenseAndServiceDeliveryDetails()
        ccofApp.groupLicenses()
        ccofApp.offerExtendedHours()
        ccofApp.addAnotherFacility()
        ccofApp.licenceUpload()
    })
}

// Test START
function runCcfriApp() {
    ccfriApp.loadFixturesAndVariables()
    cy.then(()=> {
        ccfriApp.optInFacilities()
        ccfriApp.addParentFees()
        ccfriApp.addClosures('2025-26')
    })
}

function runEceWeApp() {
    eceWeApp.loadFixturesAndVariables()
    cy.then(()=> {
        eceWeApp.optInEceWe('2025-26')
        eceWeApp.groupEceWe()
        eceWeApp.supportingDocUpload()
    })
}

describe('Group Application Test', () => {
    it('Should run through Group Application, submit and logout', () => {
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
            Cypress.env("PORTAL_USERNAME"),
            Cypress.env("PORTAL_PASSWORD"))
        cy.startNewApp('Group Provider')
    
        cy.then(()=> {
            runCcofApp()
            runCcfriApp()
            runEceWeApp()
            submitApp.summaryAndDeclaration()
        })
    })
    
})