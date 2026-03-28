function handleCardWithin(card, data) {
    cy.wrap(card).within(() => {
        Object.entries(data).forEach(([key, value]) => {
            cy.getByLabel(`${key}`).invoke('val', value).trigger('input')
        });
  });
}

class CcfriApplication{
    loadFixtures(file) {
        // The path to fixtures is different for the main fixture vs. the extra facility fixtures.
        // The extra facility files are not in the `ccfri-data` subdirectory.
        // This conditional ensures the correct path is used for both cases.
        const path = file.startsWith('extra-facs-ccfri') ? file : `/ccfri-data/${file}`;
        return cy.fixture(path).then((data)=> {
            this.optInOrOut = data.optInOrOut;
            this.parentFees = data.parentFees;
            this.closures = data.closures;
            this.facilityName = data.facilityName;
            // Also return the data itself to be used in promise chains, preventing race conditions.
            return data;
        })
    }

    loadFixturesAndVariables(file) {
        // Chain the .then() to ensure commands wait for the fixture to be loaded.
        return this.loadFixtures(file).then((fixtureData)=> {
            // For Opt-Out facilities, parentFees and closures may not be present in the fixture.
            if (this.parentFees) {
                this.paymentFrequency = this.parentFees.frequency;
            }
            if (this.closures) {
                this.closureCharges = this.closures.closureCharges;
                this.closureReason = this.closures.closureReason;
                this.fullFacilityClosureStatus = this.closures.fullFacilityClosureStatus;
            }
            // Pass the data along the chain.
            return fixtureData;
        })
    }

    optInFacilities(files) {
        cy.url().should('include', '/ccfri', {timeout: 10000})
        cy.contains('Child Care Fee Reduction Initiative (CCFRI)')
        // Use a more robust selector to ensure we are scoping within the correct facility card.
        // This gets all cards, filters to the one containing the facility name, and then acts within it.
        cy.get('.v-card').filter(`:contains("${this.facilityName}")`).first().within(()=> {
            cy.clickByText('UPDATE')
            cy.contains('label',this.optInOrOut).click()
        })

        if (files) {
            // Use .then() chained off of loadFixturesAndVariables to prevent race conditions.
            // This ensures that for each file in the loop, we use the data from that specific file.
            cy.wrap(files).each((file)=>  {
                this.loadFixturesAndVariables(`extra-facs-ccfri/${file}`).then((fixtureData) => {
                    cy.get('.v-card').filter(`:contains("${fixtureData.facilityName}")`).first().within(()=> {
                        cy.clickByText('UPDATE')
                        cy.contains('label', fixtureData.optInOrOut).click()
                    });
                })
            })
        }
        cy.clickByText('Save')
        cy.contains('Success! CCFRI Opt-In status has been saved.').should('be.visible')
        cy.clickByText('Next')
    }

    parentFeesRenewal() {
        cy.contains('Our records show this facility\'s parent fees for January 2026 to March 2026 are as follows:').should('be.visible')
        cy.contains('We have no fees on record for this facility. Click "Next" to enter your fees for the previous 24 months.')
        cy.clickByText('Next')
    }

    addParentFees(appType, term, file) {
        this.loadFixturesAndVariables(file)
        cy.then(()=> {
            let parentFeeCategories
            switch (appType) {
                case 'group':
                case 'groupOld': parentFeeCategories = this.parentFees.groupParentFeeCategories; break;
                case 'family':
                case 'familyOld': parentFeeCategories = this.parentFees.familyParentFeeCategories; break;
                case 'groupRenewal': parentFeeCategories = this.parentFees.groupRenewalParentFeeCategories; break;
                case 'familyRenewal': parentFeeCategories = this.parentFees.familyRenewalParentFeeCategories; break;
            }
            cy.contains('Enter the fees you would charge a new parent for full-time care at this facility for the months below.').should('be.visible')
            cy.contains(this.facilityName)
            cy.then(()=> {
                cy.get('.v-card.my-10').each((card, index) => {
                    const category = parentFeeCategories[index]
                    cy.wrap(card)
                        .should('contain', `${category}`)
                        .contains('label', `${this.paymentFrequency}`)
                        .click()
                    handleCardWithin(card, this.parentFees.months)
                })

                if (appType === "groupOld" || appType === 'familyOld'){
                    this.addClosures(appType, term)
                }
                cy.clickByText('Save')
                cy.contains('Success! CCFRI Parent fees have been saved.').should('be.visible')
                cy.clickByText('Next')
            })
        })
    }

    addClosures(appType, term) {
        let startDate
        let endDate
        switch (appType) {
            case 'group':
            case 'family':
            case 'familyOld':
            case 'groupOld':
                startDate = this.closures.startDate
                endDate = this.closures.endDate
                break;
            case 'groupRenewal':
            case 'familyRenewal':
                startDate = this.closures.renewalStartDate
                endDate = this.closures.renewalEndDate
        }

        if (appType != "groupOld" && appType != "familyOld"){
            cy.contains(`It is important to tell us your planned closures for the ${term} funding term to avoid any impacts on payments.`)
        }

        cy.contains('div', 'Do you charge parent fees at this facility for any closures on business days (other than provincial statutory holidays)? Only indicate the date of closures where parent fees are charged.').within(()=> {
            cy.contains('label', `${this.closureCharges}`).click()
        })

        // Opt-Out Path
        if (this.closureCharges === "No") {
            cy.clickByText('Save')
            cy.clickByText('Next')
            return
        }

        // Opt-In (Full Closure) -> TODO [CCFRI-6111] (Hedie-cgi) Implement option to add Multiple Closures to a Group App
        cy.getByLabel('Start Date').typeAndAssert(startDate)
        cy.getByLabel('End Date').typeAndAssert(endDate)
        cy.getByLabel('Closure Reason').typeAndAssert(this.closureReason)

        if (appType === "groupOld" || appType === "familyOld"){
            cy.contains('div','Did parents pay for this closure?').within(()=> {
                cy.getByLabel('Yes').click()
            })
        } else {
            cy.contains('div','Is this a full facility closure?').within(()=> {
                cy.getByLabel(`${this.fullFacilityClosureStatus}`).click()
            })

            // Opt-In (Partial Closure) -> TODO [CCFRI-6112] (Hedie-cgi) Implement ability to select Partial Closure & choose affected Care Categories
            if (this.fullFacilityClosureStatus === "No") {
            }
        }
        cy.clickByText('Save')
        cy.clickByText('Next')
    }
}

export const ccfriApp = new CcfriApplication()
