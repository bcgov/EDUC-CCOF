function allFacilitiesUnionized(attr, data) {
    cy.get(attr).each((card, index, $list) => {
        cy.wrap(card).within(() => {
            cy.getByLabel(data).click()
        })
    })
}

class EceWeApplication {
    loadFixtures() {
        return cy.fixture('eceweData').then((data)=> {
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
            this.fundingType = this.cssea.csseaMember.fundingModel
            this.unionStatus = this.cssea.csseaNonMember.response.someOrAllUnionized
            this.facilityOptInOrOut = this.facility.facilityOptInOrOut.optIn
            this.facilityUnionStatus = this.facility.facilityUnionStatus.unionized
        })
    }

    optInEceWe(term) {
        cy.contains('Early Childhood Educator Wage Enhancement (ECE-WE)').should('be.visible')
        cy.contains('.v-card', `For the ${term} funding term, would you like to opt-in to ECE-WE for any facility in your organization?`).getByLabel(`${this.optInOrOut}`).click()
    }

    groupEceWe({model = null} = {}) {
        cy.then(()=> {
            // Opt-In Path
            if (this.optInOrOut === 'Yes') {
                cy.contains('.v-card', 'Are you a public sector employer, as defined in the Public Sector Employers Act?').within(()=> {
                    cy.getByLabel(this.publicSectorEmployer).click()
                })
                cy.contains('Which of the following describes your organization?').should('be.visible')
                cy.getByLabel(this.csseaSelection).click()
                // CSSEA Non-Member
                if (this.csseaSelection === this.cssea.csseaNonMember.status) {
                    cy.getByLabel(this.unionStatus).click()
                    // CSSEA Non-Member + Union
                    if (this.unionStatus === this.cssea.csseaNonMember.someOrAllUnionizedUnionized) {
                        cy.clickByText(this.cssea.confirmation) 
                    } 
                } else {
                    if (model) {
                        this.selectFundingModel(model)
                    }
                    cy.getByLabel(this.cssea.confirmation).click()
                }

                cy.clickByText('Save')
                cy.contains('Success! ECEWE application has been saved.').should('be.visible')
                cy.clickByText('Next')

                // Opt In Facilities
                if (this.facilityOptInOrOut === this.facility.facilityOptInOrOut.optIn) {
                    cy.contains(' Opt-In All Facilities ').should('be.visible')
                    cy.clickByText(this.facilityOptInOrOut)
                    cy.clickByText(' Update ')
                    if (this.unionStatus === this.cssea.csseaNonMember.response.someOrAllUnionized || this.csseaSelection === this.cssea.csseaMember) {
                        allFacilitiesUnionized('.v-card', this.facilityUnionStatus)
                    }
                }
            }
            // Opt-Out Path
            cy.clickByText('Save')
            cy.clickByText('Next')
        })
         
    }

    selectFundingModel(fundingModel) {
        switch (fundingModel) {
            case 'provinciallyFunded': this.fundingType = this.cssea.csseaMember.fundingModel.provinciallyFunded
            case 'nonProvinciallyFunded': this.fundingType = this.cssea.csseaMember.fundingModel.nonProvinciallyFunded
            case 'mixedFunding': this.fundingType = this.cssea.csseaMember.fundingModel.mixedFunding
        }
        // Member
        cy.contains(this.fundingType).click()
    }

    familyEceWe() {
        cy.then(()=> {
            cy.clickByText('Save')
            cy.contains('Success! ECEWE application has been saved').should('be.visible')
            cy.clickByText('Next')
            // Opt-In Path
            if (this.optInOrOut === 'Yes') {
                cy.contains('On the previous page, you indicated that you would like to opt-in to ECE-WE for any facility in your organization')
                cy.clickByText('Save')
                cy.contains('Success! ECEWE Facility applications have been saved.').should('be.visible')
                cy.clickByText('Next')
            }
        })
    }

    supportingDocUpload() {
        cy.contains('Supporting Document Upload').should('be.visible')
        cy.clickByText('Next')
    }
}

export const eceWeApp = new EceWeApplication() 