function handleCardWithin(card, data) {
    cy.wrap(card).within(() => {
        Object.entries(data).forEach(([key, value]) => {
            cy.getByLabel(`${key}`).invoke('val', value).trigger('input')
        });
  });
}

class CcfriApplication{
    loadFixtures() {
        return cy.fixture('ccfriData').then((data)=> {
            this.optInOrOut = data.optInOrOut
            this.parentFees = data.parentFees
            this.closures = data.closures
        })
    }

    // QA: EDIT INPUTS HERE USING ccfriData.json in "fixtures"----->
    loadFixturesAndVariables() {
        this.loadFixtures()
        cy.then(()=> {
            this.parentFeeCategories = this.parentFees.groupParentFeeCategories
            this.paymentFrequency = this.parentFees.frequency.monthly
            this.closureCharges = this.closures.closureCharges.chargeForClosures
            this.startDate = this.closures.startDate
            this.endDate = this.closures.endDate
            this.closureReason = this.closures.closureReason
            this.fullFacilityClosureStatus = this.closures.fullFacilityClosureStatus.fullFacilityClosure
        })
    }

    optInFacilities(appType) {
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
            if (appType === 'family') {
                this.parentFeeCategories = this.parentFees.familyParentFeeCategories
            }
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
        cy.contains('It is important to tell us your planned closures for the 2025-26 funding term to avoid any impacts on payments.')
        cy.contains(' Do you charge parent fees at this facility for any closures on business days?')
        cy.contains('Do you charge parent fees at this facility for any closures on business days (other than provincial statutory holidays)? Only indicate the date of closures where parent fees are charged.')

        cy.getByLabel(`${this.closureCharges}`).click()
        // Opt-Out Path
        if (this.closureCharges === "No") {
            return
        }

        // Opt-In (Full Closure) -> TODO (Hedie-cgi) Implement option to add Multiple Closures to a Group App [CCFRI-6111]
        cy.getByLabel('Start Date').typeAndAssert(this.startDate)                        
        cy.getByLabel('End Date').typeAndAssert(this.endDate)
        cy.getByLabel('Closure Reason').typeAndAssert(this.closureReason)
        cy.contains('div','Is this a full facility closure?').within(()=> {
            cy.getByLabel(`${this.fullFacilityClosureStatus}`).click()
        })

        // Opt-In (Partial Closure) -> TODO (Hedie-cgi) Implement ability to select Partial Closure & choose affected Care Categories [CCFRI-6112]
        if (this.fullFacilityClosureStatus === "No") {

        }
        cy.clickByText('Save')
        cy.clickByText('Next')
    }
}

export const ccfriApp = new CcfriApplication()