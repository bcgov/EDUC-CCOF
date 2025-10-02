function handleCardWithin(card, data) {
    cy.wrap(card).within(() => {
        Object.entries(data).forEach(([key, value]) => {
            cy.getByLabel(`${key}`).invoke('val', value).trigger('input')
        });
  });
}

class CcfriApplication{
    startCcfriApplication() {
        let optInOrOut
        let parentFees
        let closures
        
        cy.fixture('groupApplicationDataCCFRI').then((data)=> {
            optInOrOut = data.optInOrOut
            parentFees = data.parentFees
            closures = data.closures
        })

        cy.then(()=> {
            // Update any test data here --> NOTE: Some data may need to be updated in related fixture file directly
            optInOrOut = optInOrOut.optIn
            let parentFeeCategories = parentFees.parentFeeCategories
            let paymentFrequency = parentFees.frequency.monthly
            let closureCharges = closures.closureCharges.chargeForClosures
            let startDate = closures.startDate
            let endDate = closures.endDate
            let closureReason = closures.closureReason
            let fullFacilityClosureStatus = closures.fullFacilityClosureStatus.notFullFacilityClosure


            // CCFRI - Parent Fees 
            cy.url().should('include', '/ccfri', {timeout: 10000})
            //Opt-Out Path
            if (optInOrOut == 'Opt-Out') {
                cy.contains('Child Care Fee Reduction Initiative (CCFRI)').clickByText('Update')
                cy.getByLabel(optInOrOut).click()
            } else {
            //Opt-In Path
                cy.clickByText('Opt-In All Facilities')
                cy.clickByText('Save')
                cy.clickByText('Next')
                cy.contains('Enter the fees you would charge a new parent for full-time care at this facility for the months below.').should('be.visible')
                cy.get('.v-card.my-10').each((card, index) => {
                    const category = parentFeeCategories[index]
                    cy.wrap(card)
                        .should('contain', `${category}`)
                        .contains('label', `${paymentFrequency}`)
                        .click()
                        .then(() => handleCardWithin(card, parentFees.months))
                })

                cy.clickByText('Save')
                cy.clickByText('Next')

                // CCFRI - Closures 
                cy.contains('It is important to tell us your planned closures for the 2025-26 funding term to avoid any impacts on payments.')
                cy.contains(' Do you charge parent fees at this facility for any closures on business days?')
                cy.contains('Do you charge parent fees at this facility for any closures on business days (other than provincial statutory holidays)? Only indicate the date of closures where parent fees are charged.')

                cy.getByLabel(`${closureCharges}`).click()
                // No Charge for Closures
                if (closureCharges == "No") {
                    return
                }

                // Full Closure - TODO (Hedie-cgi) Implement option to add Multiple Closures to a Group App
                cy.getByLabel('Start Date').typeAndAssert(startDate)                        
                cy.getByLabel('End Date').typeAndAssert(endDate)
                cy.getByLabel('Closure Reason').typeAndAssert(closureReason)
                cy.contains('Is this a full facility closure?')
                cy.getByLabel(`${fullFacilityClosureStatus}`).click({force: true})

                //Partial Care Category Closures
                if (fullFacilityClosureStatus == "No") {
                    //TODO (Hedie-cgi) Implement ability to select Partial Closure & choose affected Care Categories
                }
                
            
                cy.clickByText('Save')
                cy.clickByText('Next')
            }
        }) 
    }
}

export const ccfriApp = new CcfriApplication()