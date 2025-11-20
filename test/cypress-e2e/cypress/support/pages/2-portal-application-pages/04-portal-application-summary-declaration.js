class SubmitApplication {
    summaryAndDeclaration(appType) {
        cy.url().should('include', '/summary-declaration')

        // Submit App
        cy.contains('Summary and Declaration').should('be.visible')
        if (appType.includes('Renewal')) {
            cy.getByLabel('I do hereby certify that I am the authorized signing authority and that all of the information provided is true and complete to the best of my knowledge and belief.')
                .click()
        } else {
            cy.getByLabel('I, the applicant, do hereby certify that all the information provided is true and complete to the best of my knowledge and belief. By clicking this check-box, I indicate that I agree to the foregoing terms and conditions.')
                .click()
        }
        cy.getByLabel('Your Organization\'s Authorized Signing Authority').typeAndAssert('Luffy')
        cy.clickByText('Submit')
        cy.contains('Submission Complete')
        cy.clickByText('Return to your dashboard')
        cy.url()
            .should('equal', Cypress.env('PORTAL_BASE_URL'))

        if (!appType.includes('Renewal')) {
            cy.contains('.v-card', 'Apply for Child Care Operating Funding (CCOF) including:')
                .should('contain', 'Status: Submitted')
            cy.contains('.v-card', 'Child Care Fee Reduction Initiative (CCFRI) Status: SUBMITTED')
                .should('contain', 'Early Childhood Educator Wage Enhancement (ECE-WE) Status: SUBMITTED')
        } else {
            cy.contains('Renew my Funding Agreement').wrap(()=> {
                cy.get('.smallCardDisabled').should('exist')
            })
        }

        cy.contains(Cypress.env('PORTAL_USERNAME')).click()
        cy.contains('Logout').click()
    }
}

export const submitApp = new SubmitApplication()