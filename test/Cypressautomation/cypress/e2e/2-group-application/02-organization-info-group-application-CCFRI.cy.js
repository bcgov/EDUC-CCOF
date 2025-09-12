import { loginPage } from '../../support/pages/LoginPage'

describe('Group Application-CCFRI', () => {
    let parentFees
    
    beforeEach(() => {
        // Load fixture data for this test
        cy.fixture('groupApplicationDataCCFRI').then((data)=> {
            parentFees = data.parentFees
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
        const targetUrl = url.replace('/group/organization', '/ccfri');
        cy.visit(targetUrl);
        });   
    });


    it('Continue Group Application - CCFRI', () => {
    cy.clickByText('Update')
    cy.getByLabel('Opt-In').check()
    cy.clickByText('Save')
    cy.clickByText('Next')
    cy.contains('p', 'Enter the fees you would charge a new parent for full-time care at this facility for the months below.', { timeout: 10000 }).should('be.visible')
    
    // cy.getByLabel(parentFees.frequency).click()
    const parentFeeFrequency = parentFees.frequency;
    if (parentFeeFrequency == "monthly")
        cy.get('p')
        Object.entries(parentFees.parentFeeDates).forEach(([category, value]) => {
            cy.get('p').should('contain', `${category}`).selectByLabel(parentFeeFrequency)
            Object.entries(value).forEach(([month, fee]) => {
                cy.log(`current month is: ${month}`)
                cy.getByLabel(month).typeAndAssert(fee, {force: true})
            });
        });
    })
})