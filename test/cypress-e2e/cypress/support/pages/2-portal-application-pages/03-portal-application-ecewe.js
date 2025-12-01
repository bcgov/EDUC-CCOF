function allFacilitiesUnionized(attr, data) {
    cy.get(attr).each((card, index, $list) => {
        cy.wrap(card).within(() => {
            cy.getByLabel(data).click()
        })
    })
}

class EceWeApplication {
    loadFixtures() {
        return cy.fixture('/ecewe-data/eceweData').then((data)=> {
            this.cssea = data.cssea
            this.publicSectorEmployer = data.publicSectorEmployer
            this.optInOrOut = data.optInOrOut
            this.facility = data.facility
        })
    }

    loadFixturesAndVariables() {
        this.loadFixtures()
        cy.then(()=> {
            this.csseaMember = this.cssea.csseaMember
            this.csseaSelection = this.cssea.status
            this.fundingType = this.cssea.fundingModel
            this.unionStatus = this.cssea.unionStatus
            this.facilityOptInOrOut = this.facility.facilityOptInOrOut
            this.facilityUnionStatus = this.facility.facilityUnionStatus
        })
    }

    optInEceWe(term) {
        cy.contains('Early Childhood Educator Wage Enhancement (ECE-WE)').should('be.visible')
        cy.contains('.v-card', `For the ${term} funding term, would you like to opt-in to ECE-WE for any facility in your organization?`).getByLabel(`${this.optInOrOut}`).click()
    }

    groupEceWe(appType) {
        cy.then(()=> {
            // Opt-In Path
            if (this.optInOrOut === 'Yes') {
                cy.contains('.v-card', 'Are you a public sector employer, as defined in the Public Sector Employers Act?').within(()=> {
                    cy.getByLabel(this.publicSectorEmployer).click()
                })
                cy.contains('Which of the following describes your organization?').should('be.visible')
                cy.getByLabel(this.csseaSelection).click()
                // CSSEA Non-Member
                if (this.csseaMember === 'No') {
                    cy.getByLabel(this.unionStatus).click()
                    // CSSEA Non-Member + Union
                    if (this.unionStatus === "Some or all of our facilities are unionized.") {
                        cy.clickByText(this.cssea.confirmation) 
                    } 
                } else {
                    if (appType.includes('Old')) {
                        cy.contains(this.fundingType).click()
                    }
                    cy.getByLabel(this.cssea.confirmation).click()
                }

                cy.clickByText('Save')
                cy.contains('Success! ECEWE application has been saved.').should('be.visible')
                cy.clickByText('Next')

                // Opt In Facilities
                if (this.facilityOptInOrOut === 'Opt-In All Facilities') {
                    cy.contains(' Opt-In All Facilities ').should('be.visible')
                    cy.clickByText(this.facilityOptInOrOut)
                    cy.clickByText(' Update ')
                    if (this.unionStatus === "Some or all of our facilities are unionized." || this.csseaMember === 'Yes') {
                        allFacilitiesUnionized('.v-card', this.facilityUnionStatus)
                    }
                }
            }
            // Opt-Out Path
            cy.clickByText('Save')
            cy.clickByText('Next')
        })
         
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