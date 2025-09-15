import { loginPage } from '../../support/pages/LoginPage'

describe('Group Application-ECE-WE', () => {
    let cssea
    let publicSectorEmployer
    
    beforeEach(() => {
        // Load fixture data for this test
        cy.fixture('groupApplicationDataECE-WE').then((data)=> {
            cssea = data.cssea
            publicSectorEmployer = data.publicSectorEmployer
        })

        // Login & Continue application
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
        Cypress.env('USERNAME'),
        Cypress.env('PASSWORD')
        )
        cy.continueApplicationIfPresent()
        cy.url().then((url) => {
        const targetUrl = url.replace('/group/organization', '/ecewe-eligibility');
        cy.visit(targetUrl);
        });   
    });

    it('Continue Group Application - ECE-WE', () => {
        // CCFRI - Parent Fees
        cy.get('.text-h5.my-6').should('contain', 'Early Childhood Educator Wage Enhancement (ECE-WE)')
        cy.get('.v-card').should('contain', 'For the 2025-26 funding term, would you like to opt-in to ECE-WE for any facility in your organization?').getByLabel('Yes').click()
        cy.log('Can find opt-in into ECE-WE')
        cy.contains('.v-card', 'Are you a public sector employer, as defined in the Public Sector Employers Act?').within(() => {
            cy.log('able to find publicSector Employer card')
            cy.getByLabel(publicSectorEmployer.isEmployer).click()
        })

        cy.log('Works up to Public Sector Employee')
        cy.contains('.v-card', 'Which of the following describes your organization?')
        const csseaSelection = cssea.csseaMember.status
        cy.log(csseaSelection)
        cy.getByLabel(csseaSelection).click()
        cy.contains('.v-card', 'Select your funding model:')
        if (csseaSelection == cssea.csseaMember.status) {
            cy.getByLabel(cssea.csseaMember.fundingModel.provinciallyFunded).click()
            cy.getByLabel(cssea.confirmation).click()
        } else {
            const unionStatus = cssea.response.someOrAllUnionized
            cy.getByLabel(unionStatus).click()
            if (unionStatus == cssea.csseaNonMember.someOrAllUnionized) {
                cy.getByLabel(cssea.confirmation).click()
            }
        }
        cy.clickByText('Save')
        cy.clickByText('Next')
    })
})