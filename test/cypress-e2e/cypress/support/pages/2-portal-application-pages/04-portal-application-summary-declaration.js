class SubmitApplication {
    summaryAndDeclaration() {
        cy.url().should('include', '/summary-declaration')

        // Submit App
        cy.contains('Summary and Declaration').should('be.visible')
        cy.getByLabel('I, the applicant, do hereby certify that all the information provided is true and complete to the best of my knowledge and belief. By clicking this check-box, I indicate that I agree to the foregoing terms and conditions.')
            .click({force: true})
        cy.getByLabel('Your Organization\'s Authorized Signing Authority').typeAndAssert('Luffy', {force: true})
        cy.clickByText('Submit')
        cy.contains('Submission Complete')
        cy.clickByText('Return to your dashboard')
        cy.url()
            .should('equal', Cypress.env('PORTAL_BASE_URL'))
        
        // Logout
        cy.contains('.v-card', 'Apply for Child Care Operating Funding (CCOF) including:')
            .should('contain', 'Status: Submitted')
        cy.contains('.v-card', 'Child Care Fee Reduction Initiative (CCFRI) Status: SUBMITTED')
            .should('contain', 'Early Childhood Educator Wage Enhancement (ECE-WE) Status: SUBMITTED')
        cy.contains(Cypress.env('PORTAL_USERNAME')).click({force:true})
        cy.contains('Logout').click({force:true})
    }
}

export const submitApp = new SubmitApplication()