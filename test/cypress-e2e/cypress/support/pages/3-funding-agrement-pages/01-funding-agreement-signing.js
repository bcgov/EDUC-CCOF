class FundingAgreement {
    signFundingAgreement() {
        cy.contains('div', 'Manage Organization and Facilities')
            .should('be.visible')
            .clickByText('Manage Organization and Facilities')
        cy.url().should('contain', '/manage-org-facilities')
        cy.clickByText('Funding Agreement')
        cy.contains('Drafted – Provider Action Required').should('be.visible')
        cy.clickByText('View')
        cy.getByLabel('I agree, consent and certify').click({force: true})
        cy.getByLabel('Your Organization\'s Authorized Signing Authority').typeAndAssert('Luffy', {force: true})
        cy.clickByText('Submit').click({force: true})
        cy.contains('Submission Complete').should('be.visible')
        cy.clickByText('Return to Funding Agreements')
        cy.url().should('contain', 'funding-agreement-tab')
        cy.contains('Drafted – with Ministry').should('be.visible')
    }
}

export const fundingAgreement = new FundingAgreement()