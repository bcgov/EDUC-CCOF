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
        cy.get('p').should('contain', 'Enter the fees you would charge a new parent for full-time care at this facility for the months below.', { timeout: 10000 }).should('be.visible')
        
        cy.get('.v-card').each((card, index, $list) => {
            const category = parentFees.parentFeeCategories[index]
            cy.wrap(card).should('contain', `${category}`).contains('label', 'Monthly').click()
            
            cy.log(`on this category: ${category}`)
            Object.entries(parentFees.months).forEach(([month, fee]) => {
                cy.wrap(card).within(() => {
                    cy.getByLabel(`${month}`).type(fee, {force: true, delay: 0});
                });
            });

        })
    })
})