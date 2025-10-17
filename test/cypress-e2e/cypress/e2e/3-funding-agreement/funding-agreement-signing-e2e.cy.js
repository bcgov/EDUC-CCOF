import { loginPage } from '../../support/pages/1-portal-login-pages/01-portal-login.js'
import { fundingAgreement } from '../../support/pages/3-funding-agrement-pages/01-funding-agreement-signing.js'

describe('Funding Agreement Signing', () => {
    it('Should sign funding agreement and update status accordingly', () => {
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
            Cypress.env("PORTAL_USERNAME"),
            Cypress.env("PORTAL_PASSWORD"))
        cy.then(()=> {
            fundingAgreement.signFundingAgreement()
        })
    })
})