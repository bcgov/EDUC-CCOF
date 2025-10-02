function allFacilitiesUnionized(attr, data) {
    cy.get(attr).each((card, index, $list) => {
        cy.wrap(card).within(() => {
            cy.getByLabel(data).click({ force: true })
        })
    })
}

class EceWeApplication {
    
    startEceWeApplication() {
        let cssea
        let publicSectorEmployer
        let optInOrOut
        let facility
    
        cy.fixture('groupApplicationDataECE-WE').then((data)=> {
            cssea = data.cssea
            publicSectorEmployer = data.publicSectorEmployer
            optInOrOut = data.optInOrOut
            facility = data.facility
        })

        cy.then(()=> {
            // Update any test data here --> NOTE: Some data may need to be updated in related fixture file directly
            optInOrOut = optInOrOut.optIn
            publicSectorEmployer = publicSectorEmployer.isEmployer
            const csseaSelection = cssea.csseaMember.status
            const fundingType = cssea.csseaMember.fundingModel.provinciallyFunded
            const unionStatus = cssea.csseaNonMember.response.someOrAllUnionized
            const facilityOptInOrOut = facility.facilityOptInOrOut.optIn
            const facilityUnionStatus = facility.facilityUnionStatus.unionized

            // ECE-WE Eligibility
            cy.contains('Early Childhood Educator Wage Enhancement (ECE-WE)').should('be.visible')

            // Opt-in Status
            cy.contains('.v-card', 'For the 2025-26 funding term, would you like to opt-in to ECE-WE for any facility in your organization?').getByLabel(`${optInOrOut}`).click({force:true})

            // Public Sector Employer
            cy.contains('.v-card', 'Are you a public sector employer, as defined in the Public Sector Employers Act?').within(()=> {
                cy.getByLabel(publicSectorEmployer).click({force:true})
            })

            // CSSEA Type
            cy.contains('Which of the following describes your organization?').should('be.visible')
            cy.getByLabel(csseaSelection).click({force:true})
            // Non-Member
            if (csseaSelection === cssea.csseaNonMember.status) {
                cy.getByLabel(unionStatus).click({force:true})
                // Non-Member + Union
                if (unionStatus === cssea.csseaNonMember.someOrAllUnionizedUnionized) {
                    cy.clickByText(cssea.confirmation) 
                } 
            } else {
                // Member
                cy.getByLabel(fundingType).click({force:true})
                cy.getByLabel(cssea.confirmation).click({force:true})
            }
            cy.clickByText('Save')
            cy.clickByText('Next')

            if (facilityOptInOrOut === facility.facilityOptInOrOut.optIn) {
                cy.contains(' Opt-In All Facilities ').should('be.visible')
                cy.clickByText(facilityOptInOrOut)
                cy.clickByText(' Update ')
                if (unionStatus === cssea.csseaNonMember.response.someOrAllUnionized || csseaSelection === cssea.csseaMember) {
                    allFacilitiesUnionized('.v-card', facilityUnionStatus)
                }
            }
            cy.clickByText('Save')
            cy.clickByText('Next')
            cy.contains('Supporting Document Upload')
            cy.clickByText('Next')
        })
    }
}

export const eceWeApp = new EceWeApplication() 