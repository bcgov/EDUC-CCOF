import { loginPage } from '../../support/pages/LoginPage'
import 'cypress-file-upload';

describe('Group Application', () => {
  let orgData
  let facilityData
  let facilityLicenceDetailsData
  let addFacilityData

  beforeEach(() => {
    // Load fixture data for this test
    cy.fixture('groupApplicationData').then((data) => {
      orgData = data.orgData
      facilityData = data.facilityData
      facilityLicenceDetailsData = data.facilityLicenceDetailsData
      addFacilityData = data.addFacilityData
    })

    // Login
    loginPage.visitLoginPage()
    loginPage.clickLoginButton()
    loginPage.loginThroughExternalProvider(
      Cypress.env('USERNAME'),
      Cypress.env('PASSWORD')
    )
    cy.contains('What would you like to do?', { timeout: 20000 }).should('be.visible')
    cy.cancelApplicationIfPresent()
  })

  it('Start Group Application - Organization Information', () => {
    cy.clickByText('Start Application')
    cy.contains('p', 'Welcome to Child Care Operating Funding (CCOF)', { timeout: 15000 }).should('be.visible')
    cy.get('#start-application').should('be.visible').click()
    cy.contains('p', 'Welcome to Child Care Operating Funding (CCOF)').should('be.visible')
    cy.contains('.v-card-title', 'Group Provider').should('be.visible')
    cy.clickByText('Start Application')
    // Organization Information
    cy.get('.v-card-title > h3', { timeout: 10000 })
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
    cy.log('Organization Information data filled');
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
    cy.log('Facility Information data filled');
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
    cy.log('Facility Licence and Service Details data filled');
    //Add Facility Page
    cy.get('p.text-center.mb-4', { timeout: 10000 })
      .should('be.visible')
      .and('have.text', 'You have successfully applied for CCOF for the following facilities:');
    cy.get('ul.text-center > li > a > span')
      .contains(facilityData.facilityName)
      .should('be.visible');
    cy.log(`Facility name "${facilityData.facilityName}" is visible on the page.`);
    cy.contains('button', 'No').click();
    // Licence Upload Page
    cy.contains('h3', 'Licence Upload').should('be.visible');
    cy.log('Add facility page is completed')
    // Upload Licence File
    const fileName = 'Sample500kb.pdf'; // Ensure this file exists in cypress/fixtures
    cy.get('input[placeholder="Select your file"]')
      .attachFile(fileName, { force: true });
    //cy.clickByText('Save')
    cy.clickByText('Next')
    cy.log('Licence Upload page is completed')

  })
})
