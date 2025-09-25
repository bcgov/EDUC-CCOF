import { loginPage } from '../../support/pages/LoginPage'
import 'cypress-file-upload';

describe('Group Application', () => {
    let orgData
    let facilityData
    let facilityLicenceDetailsData
    let addFacilityData

    let ccfriOptInOrOut
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

    let cssea
    let publicSectorEmployer
    let eceWeOptInOrOut
    let facility

    let csseaSelection
    let facilityOptInOrOut
    let fundingType
    let unionStatus
    let facilityUnionStatus

    beforeEach(() => {
        // Load fixture data for this test
        cy.fixture('groupApplicationData').then((data) => {
            orgData = data.orgData
            facilityData = data.facilityData
            facilityLicenceDetailsData = data.facilityLicenceDetailsData
            addFacilityData = data.addFacilityData
        })

        cy.fixture('groupApplicationDataCCFRI').then((data) => {
            ccfriOptInOrOut = data.optInOrOut
            parentFees = data.parentFees
            closures = data.closures
        })

        cy.fixture('groupApplicationDataECE-WE').then((data)=> {
            cssea = data.cssea
            publicSectorEmployer = data.publicSectorEmployer
            eceWeOptInOrOut = data.optInOrOut
            facility = data.facility
        })

        // Login
        loginPage.visitLoginPage()
        loginPage.clickLoginButton()
        loginPage.loginThroughExternalProvider(
            Cypress.env('USERNAME'),
            Cypress.env('PASSWORD')
        )
        cy.get('.pb-12.text-h4').should('be.visible')
        cy.contains('What would you like to do?')

        cy.cancelApplicationIfPresent()
    })

    it('Full E2E Flow', () => {
        // Update any test data here --> NOTE: Some data may need to be updated in related fixture file directly

        // CCFRI Variables
        ccfriOptInOrOut = ccfriOptInOrOut.optIn
        parentFeeCategories = parentFees.parentFeeCategories
        paymentFrequency = parentFees.frequency.daily
        closureCharges = closures.closureCharges.chargeForClosures
        startDate = closures.startDate
        endDate = closures.endDate
        closureReason = closures.closureReason
        fullFacilityClosureStatus = closures.fullFacilityClosureStatus.fullFacilityClosure

        // ECE-WE Variables
        eceWeOptInOrOut = eceWeOptInOrOut.optIn
        publicSectorEmployer = publicSectorEmployer.isEmployer
        csseaSelection = cssea.csseaNonMember.status
        fundingType = cssea.csseaMember.fundingModel.provinciallyFunded
        unionStatus = cssea.csseaNonMember.response.noneUnionized
        facilityOptInOrOut = facility.facilityOptInOrOut.optIn
        facilityUnionStatus = facility.facilityUnionStatus.unionized

        // START 
        cy.clickByText('Start Application')
        cy.contains('p', 'Welcome to Child Care Operating Funding (CCOF)', { timeout: 15000 }).should('be.visible')
        cy.get('#start-application').should('be.visible').click()
        cy.contains('p', 'Welcome to Child Care Operating Funding (CCOF)').should('be.visible')
        cy.contains('.v-card-title', 'Group Provider').should('be.visible')
        cy.clickByText('Start Application')

        // Organization Information
        cy.get('.v-card-title > h3')
            .should('be.visible')
            .and('contain', 'Organization Information')

        // Choosing Registered Company in Type of Organization
        cy.get('#input-46').click();
        cy.getByLabel('Legal Organization Name (as it appears in BC Registries and Online Services)').typeAndAssert(orgData.legalOrgName)
        cy.getByLabel('Incorporation Number (as it appears in BC Registries and Online Services)').typeAndAssert(orgData.incorporationNumber)
        cy.getByLabel('Enter address manually').check({ force: true }).should('be.checked')
        cy.getByLabel('Mailing Address').typeAndAssert(orgData.streetAddress)
        cy.getByLabel('City/Town').typeAndAssert(orgData.city)
        cy.selectByLabel('Province', orgData.province)
        cy.getByLabel('Postal Code').typeAndAssert(orgData.postalCode)
        cy.getByLabel('Yes').check({ force: true }).should('be.checked')
        cy.getByLabel('Organization Contact Name').typeAndAssert(orgData.orgContactName)
        cy.getByLabel('Position').typeAndAssert(orgData.position)
        cy.getByLabel("Phone Number of the Organization's Authorized Signing Authority").typeAndAssert(orgData.phone)
        cy.getByLabel("Email Address of the Organization's Authorized Signing Authority").typeAndAssert(orgData.email)
        cy.clickByText('Save')
        cy.clickByText('Next')

        // Facility Information
        cy.get('.v-card-title > h3', { timeout: 10000 })
            .should('be.visible')
            .and('have.text', 'Facility Information')
        cy.getByLabel('Facility Name (as it appears on the Community Care and Assisted Living Act Licence)').typeAndAssert(facilityData.facilityName)
        cy.getByLabel('Year Facility Began Operation (YYYY)').typeAndAssert(facilityData.yearFacilityBegan)
        cy.getByLabel('Yes').check({ force: true }).should('be.checked')
        cy.get('#input-207').check({ force: true });
        cy.getByLabel('Facility Licence Number').typeAndAssert(facilityData.facilityLicence)
        cy.get('#licence-effective-date').typeAndAssert(facilityData.licenceEffectiveDate)
        cy.selectByLabel('Select Health Authority that Issued Licence', facilityData.healthAuthority)
        cy.get('#input-220').check({ force: true })
        cy.clickByText('Save')
        cy.clickByText('Next')

        // Facility Licence and Service Details
        cy.get('.v-card-title > h3', { timeout: 10000 })
            .should('be.visible')
            .and('have.text', 'Facility Licence and Service Details')
        cy.getByLabel("Maximum number of days per week you provide child care").typeAndAssert(facilityLicenceDetailsData.maxDaysPerWeek)
        cy.getByLabel("Maximum number of weeks per year you provide child care").typeAndAssert(facilityLicenceDetailsData.maxWeeksPerYear)
        cy.getByLabel("Facility hours of operation from", { timeout: 10000 }).should('be.visible').typeAndAssert(facilityLicenceDetailsData.hoursFrom)
        cy.getByLabel("Facility hours of operation to").should('exist').typeAndAssert(facilityLicenceDetailsData.hoursTo)
        cy.getByLabel(facilityLicenceDetailsData.closedEntireMonths).check({ force: true }).should('be.checked')
        cy.getByLabel(facilityLicenceDetailsData.closedMonths[0]).check({ force: true }).should('be.checked')
        cy.getByLabel(facilityLicenceDetailsData.closedMonths[1]).check({ force: true }).should('be.checked')
        cy.getByLabel(facilityLicenceDetailsData.closedMonths[2]).check({ force: true }).should('be.checked')
        const licenceCategories = facilityLicenceDetailsData.licenceCategories;

        Object.entries(licenceCategories).forEach(([category, value]) => {
            if (value.checked) {
                // Check the checkbox for the category
                cy.getByLabel(category).check({ force: true }).should('be.checked');
                // Fill the max value textbox for the category
                cy.getByLabel(`Maximum number for ${category}`).typeAndAssert(value.max);
            }
        });
        cy.getByLabel("Maximum Licensed Capacity").typeAndAssert(facilityLicenceDetailsData.MaximumLicensedCapacity)
        if (facilityLicenceDetailsData.licenceCategories.Preschool.checked) {
            Object.entries(facilityLicenceDetailsData.PreschoolSessions).forEach(([day, value]) => {
                cy.getByLabel(day).typeAndAssert(value);
            });
        }
        cy.get('div[label="Is the facility located on school property?"]')
            .find('label')
            .contains(facilityLicenceDetailsData.isOnSchoolProperty)
            .click()

        facilityLicenceDetailsData.schoolAgedCareServiceDetails.forEach(label => {
            cy.getByLabel(label).check({ force: true }).should('be.checked');
        });
        cy.get('div[label="Do you regularly offer extended hours of child care (care before 6:00 AM, after 7:00 PM, or overnight service)?"]')
            .find('label')
            .contains(facilityLicenceDetailsData.offerExtendedHoursChildCare)
            .click()

        if (facilityLicenceDetailsData.offerExtendedHoursChildCare == "Yes") {
            cy.getByLabel("Maximum number of days per week you offer extended hours of child care?").typeAndAssert(facilityLicenceDetailsData.maxDaysPerWeekExtendedHours)
            cy.getByLabel("Maximum number of weeks per year you offer extended hours of child care?").typeAndAssert(facilityLicenceDetailsData.maxWeeksPerYearExtendedHours)

            const licenceCategoriesExtendedHours = facilityLicenceDetailsData.licenceCategoriesExtendedHours;
            if (licenceCategoriesExtendedHours) {
                Object.entries(licenceCategoriesExtendedHours).forEach(([category, value]) => {
                    if (value.checked) {
                        cy.getByLabel(category).check({ force: true }).should('be.checked');
                        cy.getByLabel(`Maximum number for ${category}`).typeAndAssert(value.max);
                    }
                });
            }
        }
        cy.clickByText('Save')
        cy.clickByText('Next')

        //Add Facility Page - MULTI FACILITY TODO
        cy.get('p.text-center.mb-4', { timeout: 10000 })
            .should('be.visible')
            .and('have.text', 'You have successfully applied for CCOF for the following facilities:');
        cy.get('ul.text-center > li > a > span')
            .contains(facilityData.facilityName)
            .should('be.visible');
        cy.contains('button', 'No').click();

        // Licence Upload 
        cy.contains('h3', 'Licence Upload').should('be.visible');
        const fileName = 'Sample500kb.pdf'; // Ensure this file exists in cypress/fixtures
        cy.get('input[placeholder="Select your file"]')
            .attachFile(fileName, { force: true })
            .wait(10000)
        cy.clickByText('Save')
        cy.get('span.mr-2')
            .should('be.visible')
            .should('contain', 'Sample500kb.pdf')
        cy.clickByText('Next')

        // CCFRI - Parent Fees 
        //Opt-Out Path
        cy.url().should('contain', '/ccfri')
        if (ccfriOptInOrOut == 'Opt-Out') {
            cy.get('.text-h5.my-6')
                .should('contain', 'Child Care Fee Reduction Initiative (CCFRI)')
                .clickByText('Update')
            cy.getByLabel(ccfriOptInOrOut).click()
        } else {
            //Opt-In Path
            cy.get('.v-btn')
                .should('contain', 'Opt-In All Facilities')
            cy.clickByText('Opt-In All Facilities')
            cy.clickByText('Save')
            cy.clickByText('Next')
            cy.get('p').should('contain', 'Enter the fees you would charge a new parent for full-time care at this facility for the months below.', { timeout: 10000 }).should('be.visible')
            cy.get('.v-card.my-10').each((card, index, $list) => {
                const category = parentFeeCategories[index]
                cy.wrap(card).should('contain', `${category}`).contains('label', `${paymentFrequency}`).click()

                Object.entries(parentFees.months).forEach(([month, fee]) => {
                    cy.wrap(card).within(() => {
                        cy.getByLabel(month).then($input => {
                            cy.wrap($input).invoke('val', fee).trigger('input', { force: true });
                        });
                    });
                });
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
                // Full Closure - MULTI CLOSURE TODO
                cy.get('.v-form').should('be.visible')
                cy.getByLabel('Start Date').typeAndAssert(startDate)                        
                cy.getByLabel('End Date').typeAndAssert(endDate)
                cy.getByLabel('Closure Reason').typeAndAssert(closureReason)
                cy.get('p.span-label.pr-4').should('contain', 'Is this a full facility closure?')

                cy.get('.v-selection-control-group--inline').within(() => {
                    cy.getByLabel(`${fullFacilityClosureStatus}`).click()
                });

                //Partial Care Category Closures
                if (fullFacilityClosureStatus == "No") {
                    //TODO
                }
            }
        }
        
        cy.clickByText('Save')
        cy.clickByText('Next')

        // ECE-WE Eligibility
        cy.get('.text-h5.my-6').should('contain', 'Early Childhood Educator Wage Enhancement (ECE-WE)')
        cy.get('.v-card').should('contain', 'For the 2025-26 funding term, would you like to opt-in to ECE-WE for any facility in your organization?').getByLabel(`${eceWeOptInOrOut}`).click({ force: true })
        cy.contains('.v-card', 'Are you a public sector employer, as defined in the Public Sector Employers Act?').within(() => {
            cy.getByLabel(publicSectorEmployer).click({ force: true })
        })

        // CSSEA Type
        cy.contains('.v-card', 'Which of the following describes your organization?')
        cy.getByLabel(csseaSelection).click({ force: true })
        // Non-Member
        if (csseaSelection == cssea.csseaNonMember.status) {
            cy.getByLabel(unionStatus).click({ force: true })
            // Non-Member + Union
            if (unionStatus == cssea.csseaNonMember.someOrAllUnionizedUnionized) {
                cy.clickByText(cssea.confirmation)
            }
        } else {
            // Member
            cy.getByLabel(fundingType).click({ force: true })
            cy.getByLabel(cssea.confirmation).click({ force: true })
        }
        cy.clickByText('Save')
        cy.clickByText('Next')

        if (facilityOptInOrOut == " Opt-In All Facilities ") {
            cy.get('.v-btn')
                .should('contain', ' Opt-In All Facilities ')
            cy.clickByText(facilityOptInOrOut)
            cy.clickByText(' Update ')
            if (unionStatus == "Some or all of our facilities are unionized." || csseaSelection == cssea.csseaMember) {
                cy.get('.v-card').each((card, index, $list) => {
                    cy.wrap(card).within(() => {
                        cy.getByLabel(facilityUnionStatus).click({ force: true })
                    })
                })
            }
        }

        cy.clickByText('Save')
        cy.clickByText('Next')
        cy.get('h2.text-center')
            .should('contain', 'Supporting Document Upload')
        cy.clickByText('Next')

        // Summary & Declaration
        cy.url()
            .should('contain', '/summary-declaration')
        cy.get('.my-2')
            .should('contain', 'Summary and Declaration')
        cy.getByLabel('I, the applicant, do hereby certify that all the information provided is true and complete to the best of my knowledge and belief. By clicking this check-box, I indicate that I agree to the foregoing terms and conditions.')
            .click({ force: true })
        cy.getByLabel('Your Organization\'s Authorized Signing Authority').typeAndAssert('Luffy', { force: true })
        cy.clickByText('Submit')

        // Validate & Logout
        cy.get('.dialog-header')
            .should('contain', 'Submission Complete')
        cy.wait(5000)
        cy.clickByText('Return to your dashboard')
        cy.url()
            .should('equal', 'https://qa.mychildcareservices.gov.bc.ca/')
        cy.get('.v-col-lg-4.v-col-12')
            .should('contain','Apply for Child Care Operating Funding (CCOF) including:')
            .should('contain', 'Status: Submitted')
        cy.get('.v-card')
            .should('contain', 'Child Care Fee Reduction Initiative (CCFRI) Status: SUBMITTED')
            .should('contain', 'Early Childhood Educator Wage Enhancement (ECE-WE) Status: SUBMITTED')
        cy.get('span.v-chip').click({force: true})
        cy.get('a#logout_button').click({force:true})
    })
})