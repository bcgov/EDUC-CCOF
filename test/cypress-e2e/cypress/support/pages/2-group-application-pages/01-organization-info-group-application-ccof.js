import 'cypress-file-upload';

class CcofApplication {
  loadFixtures() {
    return cy.fixture('groupApplicationData').then((data) => {
      this.orgData = data.orgData
      this.facilityData = data.facilityData
      this.facilityLicenceDetailsData = data.facilityLicenceDetailsData
    })
  }

  validateGroupUrl(path) {
    cy.url().should('include', `/${path}/organization`)
  }

  inputOrganizationInfo() {
    cy.contains('Organization Information')
    cy.getByLabel('Registered Company').click({force: true})
    cy.getByLabel('Legal Organization Name (as it appears in BC Registries and Online Services)').typeAndAssert(this.orgData.legalOrgName)
    cy.getByLabel('Incorporation Number (as it appears in BC Registries and Online Services)').typeAndAssert(this.orgData.incorporationNumber)
    cy.getByLabel('Enter address manually').check({ force: true }).should('be.checked')
    cy.getByLabel('Mailing Address').typeAndAssert(this.orgData.streetAddress)
    cy.getByLabel('City/Town').typeAndAssert(this.orgData.city)
    cy.selectByLabel('Province', this.orgData.province)
    cy.getByLabel('Postal Code').typeAndAssert(this.orgData.postalCode)
    cy.getByLabel('Yes').check({ force: true }).should('be.checked')
    cy.getByLabel('Organization Contact Name').typeAndAssert(this.orgData.orgContactName)
    cy.getByLabel('Position').typeAndAssert(this.orgData.position)
    cy.getByLabel("Phone Number of the Organization's Authorized Signing Authority").typeAndAssert(this.orgData.phone)
    cy.getByLabel("Email Address of the Organization's Authorized Signing Authority").typeAndAssert(this.orgData.email)
    cy.clickByText('Save')
    cy.contains('Success! Organization information has been saved.').should('be.visible')
    cy.clickByText('Next')
  }

  inputFacilityInfo() {
    cy.contains('Facility Information')
    cy.getByLabel('Facility Name (as it appears on the Community Care and Assisted Living Act Licence)').typeAndAssert(this.facilityData.facilityName)
    cy.getByLabel('Year Facility Began Operation (YYYY)').typeAndAssert(this.facilityData.yearFacilityBegan)
    cy.contains('div', 'Is the Facility Street Address the same as the Organization Street Address?').within(()=> {
      cy.getByLabel('Yes').click({force: true})
    })
    cy.contains('div', 'Is the Facility Contact the same as the Organization\'s Authorized Signing Authority Information?').within(()=> {
      cy.getByLabel('Yes').click({force: true})
    })
    cy.getByLabel('Facility Licence Number').typeAndAssert(this.facilityData.facilityLicence)
    cy.getByLabel('Effective Date of Current Licence').typeAndAssert(this.facilityData.licenceEffectiveDate)
    cy.selectByLabel('Select Health Authority that Issued Licence', this.facilityData.healthAuthority)
    cy.contains('div', 'Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?').within(()=> {
      cy.getByLabel('No').click({force:true})
    })
    cy.clickByText('Save')
    cy.contains('Success! Facility information has been saved.').should('be.visible')
    cy.clickByText('Next')
  }

  licenseAndServiceDeliveryDetails() {
    cy.contains('Facility Licence and Service Details')
    cy.getByLabel("Maximum number of days per week you provide child care").typeAndAssert(this.facilityLicenceDetailsData.maxDaysPerWeek)
    cy.getByLabel("Maximum number of weeks per year you provide child care").typeAndAssert(this.facilityLicenceDetailsData.maxWeeksPerYear)
    cy.getByLabel("Facility hours of operation from").should('be.visible').typeAndAssert(this.facilityLicenceDetailsData.hoursFrom)
    cy.getByLabel("Facility hours of operation to").should('exist').typeAndAssert(this.facilityLicenceDetailsData.hoursTo)
    cy.getByLabel(this.facilityLicenceDetailsData.closedEntireMonths).check({ force: true }).should('be.checked')
    cy.getByLabel(this.facilityLicenceDetailsData.closedMonths[0]).check({ force: true }).should('be.checked')
    cy.getByLabel(this.facilityLicenceDetailsData.closedMonths[1]).check({ force: true }).should('be.checked')
    cy.getByLabel(this.facilityLicenceDetailsData.closedMonths[2]).check({ force: true }).should('be.checked')
    const licenceCategories = this.facilityLicenceDetailsData.licenceCategories;

    Object.entries(licenceCategories).forEach(([category, value]) => {
      if (value.checked) {
        cy.getByLabel(category).check({ force: true }).should('be.checked');
        cy.getByLabel(`Maximum number for ${category}`).typeAndAssert(value.max);
      }
    });

    cy.getByLabel("Maximum Licensed Capacity").typeAndAssert(this.facilityLicenceDetailsData.MaximumLicensedCapacity)
    if (this.facilityLicenceDetailsData.licenceCategories.Preschool.checked) {
      Object.entries(this.facilityLicenceDetailsData.PreschoolSessions).forEach(([day, value]) => {
        cy.getByLabel(day).typeAndAssert(value);
      });
    }
    cy.get('div[label="Is the facility located on school property?"]')
      .find('label')
      .contains(this.facilityLicenceDetailsData.isOnSchoolProperty)
      .click()

    this.facilityLicenceDetailsData.schoolAgedCareServiceDetails.forEach(label => {
      cy.getByLabel(label).check({ force: true }).should('be.checked');
    });

    cy.contains('div', 'Do you regularly offer extended hours of child care (care before 6:00 AM, after 7:00 PM, or overnight service)?').within(()=> {
      cy.getByLabel(this.facilityLicenceDetailsData.offerExtendedHoursChildCare).click({force:true})
    })

    if (this.facilityLicenceDetailsData.offerExtendedHoursChildCare === "Yes") {
      cy.getByLabel("Maximum number of days per week you offer extended hours of child care?").typeAndAssert(this.facilityLicenceDetailsData.maxDaysPerWeekExtendedHours)
      cy.getByLabel("Maximum number of weeks per year you offer extended hours of child care?").typeAndAssert(this.facilityLicenceDetailsData.maxWeeksPerYearExtendedHours)

      const licenceCategoriesExtendedHours = this.facilityLicenceDetailsData.licenceCategoriesExtendedHours;
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
    cy.contains('Application saved successfully.').should('be.visible')
    cy.clickByText('Next')
  }

  licenceUpload() {
    cy.contains('You have successfully applied for CCOF for the following facilities:')
    cy.contains(this.facilityData.facilityName)
    cy.contains('button', 'No').click();
    cy.contains('Licence Upload')
    const fileName = 'Sample500kb.pdf'; // Ensure this file exists in cypress/fixtures
    cy.get('input[placeholder="Select your file"]')
      .attachFile(fileName, { force: true })
    cy.contains('div', fileName)
    // NOTE: "Next" button loads slightly slower than Save -> wait for next FIRST then click Save to avoid
    cy.contains('button', 'Next').should('have.class', 'blueButton').then(()=> {
      cy.contains('button', 'Save').should('have.class', 'blueButton')
      .clickByText('Save')
    })
    cy.contains('Changes Successfully Saved')
      .clickByText('Next')
  }
}

export const ccofApp = new CcofApplication()
