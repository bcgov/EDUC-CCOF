import { loginPage } from '../../support/pages/LoginPage'

describe('Group Application-CCFRI', () => {
    let parentFees
    let closures
    
    beforeEach(() => {
        // Load fixture data for this test
        cy.fixture('groupApplicationDataCCFRI').then((data)=> {
            parentFees = data.parentFees
            closures = data.closures
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
        // CCFRI - Parent Fees
        cy.clickByText('Update')
        cy.getByLabel('Opt-In').check()
        cy.clickByText('Save')
        cy.clickByText('Next')
        cy.get('p').should('contain', 'Enter the fees you would charge a new parent for full-time care at this facility for the months below.', { timeout: 10000 }).should('be.visible')
        cy.get('.v-card.my-10').each((card, index, $list) => {
            const category = parentFees.parentFeeCategories[index]
            cy.wrap(card).should('contain', `${category}`).contains('label', 'Monthly').click()
            
            cy.log(`on this category: ${category}`)
            Object.entries(parentFees.months).forEach(([month, fee]) => {
                cy.wrap(card).within(() => {
                    cy.getByLabel(`${month}`).clear().type(fee, {force: true, delay: 0});
                });
            });

        })
        cy.clickByText('Save')
        cy.clickByText('Next')

        // CCFRI - Closures 
        cy.get('p').should('contain', 'It is important to tell us your planned closures for the 2025-26 funding term to avoid any impacts on payments.', { timeout: 10000 }).should('be.visible')
        cy.get('.v-card').should('contain', ' Do you charge parent fees at this facility for any closures on business days?')
        cy.get('.py-4').should('contain', 'Do you charge parent fees at this facility for any closures on business days (other than provincial statutory holidays)? Only indicate the date of closures where parent fees are charged.').getByLabel('Yes', {timeout: 10000}).click()
        cy.get('.v-form').should('be.visible')
        cy.getByLabel('Start Date').typeAndAssert(closures.startDate)                        
        cy.getByLabel('End Date').typeAndAssert(closures.endDate)
        cy.getByLabel('Closure Reason').typeAndAssert(closures.closureReason)
        cy.get('p.span-label.pr-4').should('contain', 'Is this a full facility closure?')
        cy.get('.v-selection-control-group--inline').within(() => {
            cy.getByLabel('Yes').click()
        })
        cy.clickByText('Save')
        cy.clickByText('Next')

    })
})