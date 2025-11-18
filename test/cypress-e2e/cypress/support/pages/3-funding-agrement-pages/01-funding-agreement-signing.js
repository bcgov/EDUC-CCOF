class FundingAgreement {
    signFundingAgreement() {
        // Navigate to FA pending signing
        cy.contains('div', 'Manage Organization and Facilities')
            .should('be.visible')
            .clickByText('Manage Organization and Facilities')
        cy.url().should('contain', '/manage-org-facilities')
        cy.clickByText('Funding Agreement')
        cy.contains('Drafted – Provider Action Required').should('be.visible')
        cy.clickByText('View')
        // TODO [CCFRI-6183] (Hedie-cgi) - Validation of FA PDF requires additional npm package pdf-parse (pending download due to Shai-Hulud worm)

        // Validate PDF & submit
        cy.contains('Carefully review your funding agreement.').should('be.visible')
        cy.getByLabel('I agree, consent and certify').click()
        cy.getByLabel('Your Organization\'s Authorized Signing Authority').typeAndAssert('Luffy')
        cy.clickByText('Submit').click()
        cy.contains('Submission Complete').should('be.visible')
        cy.contains('Your funding agreement has been signed. Refer to the Funding Agreements in Account Management for updates to your agreement.')
        cy.clickByText('Return to Funding Agreements')
        cy.url().should('contain', 'funding-agreement-tab')
        cy.contains('Drafted - with Ministry').should('be.visible')
    }
}

export const fundingAgreement = new FundingAgreement()