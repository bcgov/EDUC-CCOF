import { loginPage } from '../../support/pages/LoginPage'

describe('Group Application-Declaration', () => {
    
    beforeEach(() => {
        // Login & Continue application
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
        Cypress.env('USERNAME'),
        Cypress.env('PASSWORD')
        )
        cy.continueApplicationIfPresent()
        cy.url().then((url) => {
        const targetUrl = url.replace('/group/organization', '/summary-declaration');
        cy.visit(targetUrl);
        });   
    });

    it('Continue Group Application - Summary & Declaration', () => {
        cy.get('.my-2').should('contain', 'Summary and Declaration')
        cy.getByLabel('I, the applicant, do hereby certify that all the information provided is true and complete to the best of my knowledge and belief. By clicking this check-box, I indicate that I agree to the foregoing terms and conditions.')
            .click({force: true})
        cy.getByLabel('Your Organization\'s Authorized Signing Authority').typeAndAssert('Luffy', {force: true})
    })
})