function handleCardWithin(card, data) {
    cy.wrap(card).within(() => {
        Object.entries(data).forEach(([key, value]) => {
            cy.getByLabel(`${key}`).invoke('val', value).trigger('input')
        });
  });
}

class CcfriApplication{
    loadFixtures() {
        return cy.fixture('groupApplicationDataCCFRI').then((data)=> {
            this.optInOrOut = data.optInOrOut
            this.parentFees = data.parentFees
            this.closures = data.closures
        })
    }

    loadFixturesAndVariables() {
        this.loadFixtures()
        cy.then(()=> {
            this.parentFeeCategories = this.parentFees.parentFeeCategories
            this.paymentFrequency = this.parentFees.frequency.monthly
            this.closureCharges = this.closures.closureCharges.chargeForClosures
            this.startDate = this.closures.startDate
            this.endDate = this.closures.endDate
            this.closureReason = this.closures.closureReason
            this.fullFacilityClosureStatus = this.closures.fullFacilityClosureStatus.notFullFacilityClosure
        })
    }

    optInFacilities() {
        // CCFRI - Parent Fees 
        cy.url().should('include', '/ccfri', {timeout: 10000})
        //Opt-Out Path
        if (this.optInOrOut === 'Opt-Out') {
            cy.contains('Child Care Fee Reduction Initiative (CCFRI)').clickByText('Update')
            cy.getByLabel(this.optInOrOut).click()
        } else {
            //Opt-In Path
            cy.clickByText('Opt-In All Facilities')
            cy.clickByText('Save')
            cy.clickByText('Next')
            cy.contains('Enter the fees you would charge a new parent for full-time care at this facility for the months below.').should('be.visible')
            cy.get('.v-card.my-10').each((card, index) => {
                const category = this.parentFeeCategories[index]
                cy.wrap(card)
                    .should('contain', `${category}`)
                    .contains('label', `${this.paymentFrequency}`)
                    .click()
                    .then(() => handleCardWithin(card, this.parentFees.months))
            })
            cy.clickByText('Save')
            cy.clickByText('Next')
        }
    }

    addClosures() {
        // CCFRI - Closures 
        cy.contains('It is important to tell us your planned closures for the 2025-26 funding term to avoid any impacts on payments.')
        cy.contains(' Do you charge parent fees at this facility for any closures on business days?')
        cy.contains('Do you charge parent fees at this facility for any closures on business days (other than provincial statutory holidays)? Only indicate the date of closures where parent fees are charged.')

        cy.getByLabel(`${this.closureCharges}`).click()
        // No Charge for Closures
        if (this.closureCharges === "No") {
            return
        }

        // Full Closure - TODO (Hedie-cgi) Implement option to add Multiple Closures to a Group App
        cy.getByLabel('Start Date').typeAndAssert(this.startDate)                        
        cy.getByLabel('End Date').typeAndAssert(this.endDate)
        cy.getByLabel('Closure Reason').typeAndAssert(this.closureReason)
        cy.contains('Is this a full facility closure?')
        cy.getByLabel(`${this.fullFacilityClosureStatus}`).click({force: true})

        //Partial Care Category Closures
        if (this.fullFacilityClosureStatus === "No") {
            //TODO (Hedie-cgi) Implement ability to select Partial Closure & choose affected Care Categories
        }
        cy.clickByText('Save')
        cy.clickByText('Next')
    }
}

export const ccfriApp = new CcfriApplication()