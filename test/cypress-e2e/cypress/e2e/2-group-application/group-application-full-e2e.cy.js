import { loginPage } from '../../support/pages/1-portal-login-pages/01-portal-login.js'
import { ccofApp } from '../../support/pages/2-group-application-pages/01-organization-info-group-application-ccof.js'
import { ccfriApp } from '../../support/pages/2-group-application-pages/02-organization-info-group-application-CCFRI.js'
import { eceWeApp } from '../../support/pages/2-group-application-pages/03-organization-info-group-application-ECE-WE.js'
import { submitApp } from '../../support/pages/2-group-application-pages/04-organization-info-group-application-Declaration.js'

function runCcofApp() {
    ccofApp.loadFixtures()
    cy.then(()=>{
        ccofApp.validateGroupUrl('group')
        ccofApp.inputOrganizationInfo()
        ccofApp.inputFacilityInfo()
        ccofApp.licenseAndServiceDeliveryDetails()
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

describe('Group Application Test', () => {
    
    it('Full E2E Flow', () => {
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
            Cypress.env('USERNAME'),
            Cypress.env('PASSWORD'))
        cy.startNewApp()
    
        cy.then(()=> {
            runCcofApp()
            runCcfriApp()
            eceWeApp.startEceWeApplication()
            submitApp.summaryAndDeclaration()
        })
    })
    
})