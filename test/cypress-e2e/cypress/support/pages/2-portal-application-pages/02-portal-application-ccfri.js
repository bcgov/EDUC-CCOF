function handleCardWithin(card, data) {
    cy.wrap(card).within(() => {
        Object.entries(data).forEach(([key, value]) => {
            cy.getByLabel(`${key}`).invoke('val', value).trigger('input')
        });
  });
}

class CcfriApplication{
    loadFixtures(file) {
        const path = file.startsWith('extra-facs-ccfri') ? file : `/ccfri-data/${file}`;
        return cy.fixture(path).then((data)=> {
            this.optInOrOut = data.optInOrOut;
            this.parentFees = data.parentFees;
            this.closures = data.closures;
            this.facilityName = data.facilityName;
            return data;
        })
    }

    loadFixturesAndVariables(file) {
        return this.loadFixtures(file).then((fixtureData)=> {
            if (this.parentFees) {
                this.paymentFrequency = this.parentFees.frequency;
            }
            if (this.closures) {
                this.closureCharges = this.closures.closureCharges;
                this.closureReason = this.closures.closureReason;
                this.fullFacilityClosureStatus = this.closures.fullFacilityClosureStatus;
            }
            return fixtureData;
        })
    }

    optInFacilities(files) {
        cy.url().should('include', '/ccfri', {timeout: 10000})
        cy.contains('Child Care Fee Reduction Initiative (CCFRI)')
        cy.get('.v-card').filter(`:contains("${this.facilityName}")`).first().within(()=> {
            cy.clickByText('UPDATE')
            cy.contains('label',this.optInOrOut).click()
        })

        if (files) {
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
        const getParentFeeCategories = () => {
            switch (appType) {
                case 'group':
                case 'groupOld':
                    return this.parentFees.groupParentFeeCategories
                case 'family':
                case 'familyOld':
                    return this.parentFees.familyParentFeeCategories
                case 'groupRenewal':
                    return this.parentFees.groupRenewalParentFeeCategories
                case 'familyRenewal':
                    return this.parentFees.familyRenewalParentFeeCategories
                default:
                    return []
            }
        }

        const fillFeeCard = (category) => {
            const normalizedCategory = category.trim()

            // Find the .card-title whose visible text matches the normalized category
            cy.get('.card-title').filter((i, el) => {
                const txt = Cypress.$(el).text().trim()
                return txt === normalizedCategory
            }).first()
                .closest('.v-card.my-10')
                .as('feeCard')

            // Debug: log raw fixture value and normalized expected category
            cy.log(`Raw fixture category: ${category}`)
            cy.log(`Normalized expected category: ${normalizedCategory}`)

            // Log the card title text/html and char codes to help diagnose whitespace/nbsp issues
            cy.get('@feeCard').then($card => {
                const $title = $card.find('.card-title').first()
                const titleText = $title.text()
                cy.log(`Card title text: ${titleText}`)
                // Browser console prints are useful for char codes and innerHTML
                // eslint-disable-next-line no-console
                console.log('card innerHTML:', $title.html())
                // eslint-disable-next-line no-console
                console.log('card char codes:', titleText.split('').map(c => c.codePointAt(0)))
            })

            cy.get('@feeCard')
                .contains('label', `${this.paymentFrequency}`)
                .click()

            cy.get('@feeCard').then((card) => {
                handleCardWithin(card, this.parentFees.months)
            })
        }

        const fillAllFees = (categories) => {
            categories.filter(Boolean).forEach((category) => {
                fillFeeCard(category)
            })
        }

        cy.then(() => {
            cy.contains('Enter the fees you would charge a new parent for full-time care at this facility for the months below.').should('be.visible')
            cy.contains(this.facilityName)
            fillAllFees(getParentFeeCategories())

            if (appType === "groupOld" || appType === 'familyOld'){
                this.addClosures(appType, term)
            }
            cy.clickByText('Save')
            cy.contains('Success! CCFRI Parent fees have been saved.').should('be.visible')
            cy.clickByText('Next')
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

        // Opt-In (Full Closure) -> TODO  (Hedie-cgi) Implement option to add Multiple Closures to a Group App
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

            // Opt-In (Partial Closure) -> TODO (Hedie-cgi) Implement ability to select Partial Closure & choose affected Care Categories
            if (this.fullFacilityClosureStatus === "No") {
            }
        }
        cy.clickByText('Save')
        cy.clickByText('Next')
    }
}

export const ccfriApp = new CcfriApplication()
