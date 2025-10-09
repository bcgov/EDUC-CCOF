function allFacilitiesUnionized(attr, data) {
    cy.get(attr).each((card, index, $list) => {
        cy.wrap(card).within(() => {
            cy.getByLabel(data).click({ force: true })
        })
    })
}

class EceWeApplication {
    loadFixtures() {
        return cy.fixture('groupApplicationDataECE-WE').then((data)=> {
            this.cssea = data.cssea
            this.publicSectorEmployer = data.publicSectorEmployer
            this.optInOrOut = data.optInOrOut
            this.facility = data.facility
        })
    }

    loadFixturesAndVariables() {
        this.loadFixtures()
        cy.then(()=> {
            this.optInOrOut = this.optInOrOut.optIn
            this.publicSectorEmployer = this.publicSectorEmployer.isEmployer
            this.csseaSelection = this.cssea.csseaMember.status
            this.fundingType = this.cssea.csseaMember.fundingModel.provinciallyFunded
            this.unionStatus = this.cssea.csseaNonMember.response.someOrAllUnionized
            this.facilityOptInOrOut = this.facility.facilityOptInOrOut.optIn
            this.facilityUnionStatus = this.facility.facilityUnionStatus.unionized
        })
    }

    optInEceWe() {
        // ECE-WE Eligibility
        cy.contains('Early Childhood Educator Wage Enhancement (ECE-WE)').should('be.visible')

        // Opt-in Status
        cy.contains('.v-card', 'For the 2025-26 funding term, would you like to opt-in to ECE-WE for any facility in your organization?').getByLabel(`${this.optInOrOut}`).click({force:true})

        // Public Sector Employer
        cy.contains('.v-card', 'Are you a public sector employer, as defined in the Public Sector Employers Act?').within(()=> {
            cy.getByLabel(this.publicSectorEmployer).click({force:true})
        })

        // CSSEA Type
        cy.contains('Which of the following describes your organization?').should('be.visible')
        cy.getByLabel(this.csseaSelection).click({force:true})
        // Non-Member
        if (this.csseaSelection === this.cssea.csseaNonMember.status) {
            cy.getByLabel(this.unionStatus).click({force:true})
            // Non-Member + Union
            if (this.unionStatus === this.cssea.csseaNonMember.someOrAllUnionizedUnionized) {
                cy.clickByText(this.cssea.confirmation) 
            } 
        } else {
            // Member
            cy.getByLabel(this.fundingType).click({force:true})
            cy.getByLabel(this.cssea.confirmation).click({force:true})
        }
        cy.clickByText('Save')
        cy.clickByText('Next')
    }

    optInFacilities() {
        if (this.facilityOptInOrOut === this.facility.facilityOptInOrOut.optIn) {
                cy.contains(' Opt-In All Facilities ').should('be.visible')
                cy.clickByText(this.facilityOptInOrOut)
                cy.clickByText(' Update ')
                if (this.unionStatus === this.cssea.csseaNonMember.response.someOrAllUnionized || this.csseaSelection === this.cssea.csseaMember) {
                    allFacilitiesUnionized('.v-card', this.facilityUnionStatus)
                }
            }
        cy.clickByText('Save')
        cy.clickByText('Next')
        cy.contains('Supporting Document Upload')
        cy.clickByText('Next')
    }
}

export const eceWeApp = new EceWeApplication() 