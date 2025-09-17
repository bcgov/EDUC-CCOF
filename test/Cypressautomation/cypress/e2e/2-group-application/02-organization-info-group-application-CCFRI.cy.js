import { loginPage } from '../../support/pages/LoginPage'

describe('Group Application-CCFRI', () => {
    let optInOrOut
    let parentFees
    let closures

    let parentFeeCategories
    let paymentFrequency
    let closureCharges
    let startDate
    let endDate
    let closureReason
    let fullFacilityClosureStatus
    let careCategoriesAffected
    
    beforeEach(() => {
        // Load fixture data for this test
        cy.fixture('groupApplicationDataCCFRI').then((data)=> {
            optInOrOut = data.optInOrOut
            parentFees = data.parentFees
            closures = data.closures
        })

        // Login & Continue application
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
        Cypress.env('USERNAME'),
        Cypress.env('PASSWORD'))

        cy.wait(10000)
        cy.continueApplicationIfPresent()
        cy.url().should('include', '/group/organization')
        cy.url().then((url) => {
            const targetUrl = url.replace('/group/organization', '/ccfri');
            cy.visit(targetUrl);
        });  
    });

    it('Continue Group Application - CCFRI', () => {
        // Update any test data here --> NOTE: Some data may need to be updated in related fixture file directly
        optInOrOut = optInOrOut.optIn
        parentFeeCategories = parentFees.parentFeeCategories
        paymentFrequency = parentFees.frequency.monthly
        closureCharges = closures.closureCharges.chargeForClosures
        startDate = closures.startDate
        endDate = closures.endDate
        closureReason = closures.closureReason
        fullFacilityClosureStatus = closures.fullFacilityClosureStatus.notFullFacilityClosure
        careCategoriesAffected = closures.careCategoriesAffected

        // CCFRI - Parent Fees 
        //Opt-Out Path
        if (optInOrOut == 'Opt-Out') {
            cy.get('.text-h5.my-6').should('contain', 'Child Care Fee Reduction Initiative (CCFRI)', {timmeout: 8000}).clickByText('Update')
            cy.getByLabel(optInOrOut).click()
        } else {
        //Opt-In Path
            cy.clickByText('Opt-In All Facilities')
            cy.clickByText('Save')
            cy.clickByText('Next')
            cy.get('p').should('contain', 'Enter the fees you would charge a new parent for full-time care at this facility for the months below.', { timeout: 10000 }).should('be.visible')
            cy.get('.v-card.my-10').each((card, index, $list) => {
                const category = parentFeeCategories[index]
                cy.wrap(card).should('contain', `${category}`).contains('label', `${paymentFrequency}`).click()

                // Object.entries(parentFees.months).forEach(([month, fee]) => {
                //     cy.wrap(card).within(() => {
                //         // cy.getByLabel(`${month}`).clear().type(fee, {force: true, delay: 0});
                //         cy.getByLabel(`${month}`).invoke('val', fee).trigger('input')
                //     });
                // });

            })
            cy.clickByText('Save')
            cy.clickByText('Next')

            // CCFRI - Closures 
            cy.get('p').should('contain', 'It is important to tell us your planned closures for the 2025-26 funding term to avoid any impacts on payments.', { timeout: 30000 })
            cy.get('.v-card').should('contain', ' Do you charge parent fees at this facility for any closures on business days?')
            cy.get('.py-4').should('contain', 'Do you charge parent fees at this facility for any closures on business days (other than provincial statutory holidays)? Only indicate the date of closures where parent fees are charged.', { timeout: 30000 })

            cy.getByLabel(`${closureCharges}`).click()
            // No Charge for Closures
            if (closureCharges == "No") {
                return
            } else {
            // Charge for Closures
                cy.get('.v-form').should('be.visible')
                cy.getByLabel('Start Date').typeAndAssert(startDate)                        
                cy.getByLabel('End Date').typeAndAssert(endDate)
                cy.getByLabel('Closure Reason').typeAndAssert(closureReason)
                cy.get('p.span-label.pr-4').should('contain', 'Is this a full facility closure?')

                cy.get('.v-selection-control-group--inline').within(() => {
                    cy.getByLabel(`${fullFacilityClosureStatus}`).click()
                });

                //Not Full Facility Closure
                if (fullFacilityClosureStatus == "No") {
                    cy.get('.span-label.pr-8.mb-2').should('contain', 'Select all care categories that are affected by the closure:')
                    careCategoriesAffected.forEach((category) => {
                        
                        //BUG - CAN'T FIND DROPDOWN
                        cy.getByLabel('Care Categories').click({force: true})
                        cy.get('.v-list.v-list--one-line').scrollTo('bottom', {ensureScrollable: false})
                        cy.selectByLabel(`${category}`, {force: true})
                    })

                }
            }
        }
        cy.clickByText('Save')
        cy.clickByText('Next')

    })
})