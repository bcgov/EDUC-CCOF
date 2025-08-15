import { loginPage } from '../../support/pages/LoginPage'

describe('Group Application', () => {
  let orgData
  let facilityData
  let facilityLicenceDetailsData

  beforeEach(() => {
    // Load fixture data for this test
    cy.fixture('groupApplicationData').then((data) => {
      orgData = data.orgData
      facilityData = data.facilityData
      facilityLicenceDetailsData = data.facilityLicenceDetailsData
    })

    // Login
    loginPage.visitLoginPage()
    loginPage.clickLoginButton()
    loginPage.loginThroughExternalProvider(
      Cypress.env('USERNAME'),
      Cypress.env('PASSWORD')
    )

    // Ensure dashboard ready + clean state
    cy.contains('What would you like to do?', { timeout: 20000 }).should('be.visible')
    cy.cancelApplicationIfPresent()
  })

  it('starts a Group Application and completes Organization & Facility Information with fixture data', () => {
    // Start flow
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
    //cy.get('[data-cy="Legal Name"]')
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
    //cy.assertAutoFilledNotEmpty(['Facility Street Address', 'City/Town','Province','Postal Code'])
    cy.get('#input-207').check({ force: true });
    cy.getByLabel('Facility Licence Number').typeAndAssert(facilityData.facilityLicence)
    cy.get('#licence-effective-date').typeAndAssert(facilityData.licenceEffectiveDate)
    cy.selectByLabel('Select Health Authority that Issued Licence', facilityData.healthAuthority)
    cy.get('#input-220').check({ force: true })
    cy.clickByText('Save')
    cy.clickByText('Next')
    
// Facility licence and service details page
cy.get('.v-card-title > h3', { timeout: 10000 })
      .should('be.visible')
      .and('have.text', 'Facility Licence and Service Details')
//cy.getByLabel('Maximum number of days per week you provide child care').typeAndAssert(facilityLicenceDetailsData.maxDaysPerWeek)
//cy.getByLabel('Maximum number of weeks per year you provide child care').typeAndAssert(facilityLicenceDetailsData.maxWeeksPerYear)
cy.get('#input-382').should('be.visible')
cy.get('#input-382').clear().type ('5');
cy.get('#input-384').clear().type ('52');
})
})
