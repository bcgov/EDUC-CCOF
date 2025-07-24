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
    // cy.get('p.px-6.py-3.card-title.font-weight-bold', { timeout: 10000 })
    //     .eq(0)
    //     .should('be.visible')
    //     .and('have.text', ' Parent Fees 2024-25 FY: Full-Time 0 to 18 months')
    
    cy.getByLabel(parentFees.frequency).click()
    cy.log('parent fee frequency selected')
    const parentFeeFrequency = parentFees.frequency;
    cy.log(`this is the frequency: ${parentFeeFrequency}`)
    if (parentFeeFrequency == "monthly")
        Object.entries(parentFees.parentFeeDates).forEach(([category, value]) => {
            cy.log(`filling info out for ${category}`)
            // cy.get('pa-8.my-2').debug()

            // cy.get('pa-8.my-2.py-2', { timeout: 10000 }).contains('my-2.py-2', 'Enter your highest monthly parent fee before CCFRI is applied in every month below. If there is a month where you do not charge a parent fee, enter zero.', { timeout: 10000 }).should('be.visible')
            
            Object.entries(value).forEach(([month, fee]) => {
                cy.log(`current month is: ${month}`)
                // cy.getByLabel(month).should('be.visible').and('have.text', `${month}`)
                cy.getByLabel(month).typeAndAssert(fee, {force: true})
            });
        });
    })
})