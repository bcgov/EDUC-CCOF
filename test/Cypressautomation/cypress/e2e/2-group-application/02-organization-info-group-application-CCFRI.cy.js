import { loginPage } from '../../support/pages/LoginPage'

describe('Group Application-CCFRI', () => {

    
    before(() => {
        // Login
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
    })
})