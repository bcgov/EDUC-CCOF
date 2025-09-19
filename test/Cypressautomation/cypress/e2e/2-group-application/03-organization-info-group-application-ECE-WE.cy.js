import { loginPage } from '../../support/pages/LoginPage'

describe('Group Application-ECE-WE', () => {
    let cssea
    let publicSectorEmployer
    let optInOrOut
    let facility

    let csseaSelection
    let facilityOptInOrOut
    let fundingType
    let unionStatus
    let facilityUnionStatus
    
    
    beforeEach(() => {
        // Load fixture data for this test
        cy.fixture('groupApplicationDataECE-WE').then((data)=> {
            cssea = data.cssea
            publicSectorEmployer = data.publicSectorEmployer
            optInOrOut = data.optInOrOut
            facility = data.facility
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
        const targetUrl = url.replace('/group/organization', '/ecewe-eligibility');
        cy.visit(targetUrl);
        });   
    });

    it('Continue Group Application - ECE-WE', () => {
        optInOrOut = optInOrOut.optIn
        publicSectorEmployer = publicSectorEmployer.isEmployer
        csseaSelection = cssea.csseaMember.status
        fundingType = cssea.csseaMember.fundingModel.provinciallyFunded
        unionStatus = cssea.csseaNonMember.response.someOrAllUnionized
        facilityOptInOrOut = facility.facilityOptInOrOut.optIn
        facilityUnionStatus = facility.facilityUnionStatus.unionized

        // ECE-WE Eligibility
        cy.get('.text-h5.my-6').should('contain', 'Early Childhood Educator Wage Enhancement (ECE-WE)')

        // Opt-in Status
        cy.get('.v-card').should('contain', 'For the 2025-26 funding term, would you like to opt-in to ECE-WE for any facility in your organization?').getByLabel(`${optInOrOut}`).click({force:true})

        // Public Sector Employer
        cy.contains('.v-card', 'Are you a public sector employer, as defined in the Public Sector Employers Act?').within(() => {
            cy.getByLabel(publicSectorEmployer).click({force:true})
        })

        // CSSEA Type
        cy.contains('.v-card', 'Which of the following describes your organization?')
        cy.getByLabel(csseaSelection).click({force:true})
        // Non-Member
        if (csseaSelection == cssea.csseaNonMember.status) {
            cy.getByLabel(unionStatus).click({force:true})
            // Non-Member + Union
            if (unionStatus == cssea.csseaNonMember.someOrAllUnionizedUnionized) {
                cy.clickByText(cssea.confirmation) 
            } 
        } else {
            // Member
            cy.getByLabel(fundingType).click({force:true})
            cy.getByLabel(cssea.confirmation).click({force:true})
        }
        cy.clickByText('Save')
        cy.clickByText('Next')

        if (facilityOptInOrOut == "Opt-In All Facilities") {
            cy.clickByText(facilityOptInOrOut)
            if (unionStatus == "Some or all of our facilities are unionized." || csseaSelection == cssea.csseaMember) {
                cy.get('.v-card').each((card, index, $list) => {
                    cy.wrap(card).within(()=>{
                        cy.getByLabel(facilityUnionStatus).click({force: true})
                    })
                })
            }
        }

        if (unionStatus == "Some or all of our facilities are unionized." || csseaSelection == cssea.csseaMember) {
            if (facilityOptInOrOut == "Opt-In All Facilities") {
                
            }
        }
        cy.clickByText('Save')
        cy.clickByText('Next')
        cy.clickByText('Next')
    })
})