import 'cypress-file-upload';

class CcofApplication {
  loadFixtures() {
    return cy.fixture('ccofData').then((data) => {
      this.orgData = data.orgData
      this.facilityData = data.facilityData
      this.facilityLicenceDetailsData = data.facilityLicenceDetailsData
    })
  }
  
  loadFixturesAndVariables() {
    this.loadFixtures()
    cy.then(()=> {
      this.orgType = this.orgData.typeOfOrganization
      this.orgInfo = this.orgData.orgInfo
      this.licenceInfo = this.facilityLicenceDetailsData.licenceInfo
      this.schoolProperty = this.facilityLicenceDetailsData.isOnSchoolProperty
      this.preschoolSessions = this.facilityLicenceDetailsData.PreschoolSessions
      this.maxLicensedCap = this.facilityLicenceDetailsData.maximumLicensedCapacity
      this.maxChildCareSpaces = this.facilityLicenceDetailsData.maxChildCareSpaces
      this.extendedHours = this.facilityLicenceDetailsData.offerExtendedHoursChildCare
      this.extendedMaxDays = this.facilityLicenceDetailsData.maxDaysPerWeekExtendedHours
      this.extendedMaxWeeks = this.facilityLicenceDetailsData.maxWeeksPerYearExtendedHours
      this.extendedMaxSpaces = this.facilityLicenceDetailsData.maxSpacesExtendedHours
      this.schoolAgedCare = this.facilityLicenceDetailsData.schoolAgedCareServiceDetails
      this.addFacilityData = this.facilityLicenceDetailsData.addFacilityData.addAnotherFacility
    })
  }

  validateGroupUrl(path) {
    switch(path) {
      case "group":
      case "groupOld": path = "group"; break;
      case "family":
      case "familyOld": path = "family"; break;
    }
    cy.url().should('include', `/${path}/organization`)
  }

  // TODO [CCFRI-6301] (Hedie-cgi) - Add paths for selecting other Organization Types (e.g. Sole Proprietorship)
  inputOrganizationInfo(appType) {
    switch (appType) {
      case 'group':
      case 'family':
        cy.contains('Organization Information').should('be.visible')
        cy.contains('Type of Organization').should('be.visible')
        cy.getByLabel(this.orgType).click()
        cy.getByLabel('Legal Organization Name (as it appears in BC Registries and Online Services)').typeAndAssert(this.orgInfo.legalOrgName)
        cy.getByLabel('Incorporation Number (as it appears in BC Registries and Online Services)').typeAndAssert(this.orgInfo.incorporationNumber)
        cy.contains('Organization Mailing Address').should('be.visible')
        cy.getByLabel('Enter address manually').check().should('be.checked')
        cy.getByLabel('Mailing Address').typeAndAssert(this.orgInfo.streetAddress)
        cy.getByLabel('City/Town').typeAndAssert(this.orgInfo.city)
        cy.selectByLabel('Province', this.orgInfo.province)
        cy.getByLabel('Postal Code').typeAndAssert(this.orgInfo.postalCode)
        cy.contains('Organization Street Address same as Mailing Address').should('be.visible')
          .getByLabel('Yes').check()
          .should('be.checked')
        cy.contains('Organization Contact Information').should('be.visible')
        cy.getByLabel('Business Phone').typeAndAssert(this.orgInfo.phone)
        cy.getByLabel('Email Address').typeAndAssert(this.orgInfo.email)
        break;
      
      case 'familyOld':
        cy.getByLabel('Name of Care Provider (if registered company)').typeAndAssert('Luffy')
        cy.contains('BC').should('be.visible')
        cy.getByLabel('Year Facility began Operation (YYYY)').typeAndAssert(this.facilityData.yearFacilityBegan)

      case 'groupOld':
        cy.getByLabel('Legal Name (first, middle and last) or Organization (as it appears in BC corporate Registry)').typeAndAssert(this.orgInfo.legalOrgName)
        cy.getByLabel('Incorporation Number (as it appears in BC Corporate Registry)').typeAndAssert(this.orgInfo.incorporationNumber)
        cy.contains('Organization Mailing Address').should('be.visible')
        if (appType === 'familyOld') {
          cy.getByLabel('Name of Care Provider (if registered company)').typeAndAssert('Luffy')
          cy.contains('BC').should('be.visible')
          cy.getByLabel('Year Facility began Operation (YYYY)').typeAndAssert(this.facilityData.yearFacilityBegan)
        }
        cy.getByLabel('Mailing Address').typeAndAssert(this.orgInfo.streetAddress)
        cy.getByLabel('City/Town').typeAndAssert(this.orgInfo.city)
        cy.getByLabel('Postal Code').typeAndAssert(this.orgInfo.postalCode)
        cy.contains('Organization Street Address same as Mailing Address').should('be.visible').click()
        if (appType === 'groupOld') {
          cy.contains('Contact Information').should('be.visible')
          cy.getByLabel('Organization Contact Name').typeAndAssert(this.orgInfo.facilityContact)
          cy.getByLabel('Position').typeAndAssert(this.orgInfo.position)
        }
        cy.contains('div', 'BCeID') .within(()=> {
          cy.get('input:disabled').should('have.value', Cypress.env('PORTAL_USERNAME'))
        })
        cy.getByLabel('Business Phone').typeAndAssert(this.orgInfo.phone)
        cy.getByLabel('E-mail Address of Signing Authority').typeAndAssert(this.orgInfo.email)
        cy.contains('Type of Organization').should('be.visible')
        cy.contains('.v-col-md-6','Type of Organization').should('be.visible').within(()=> {
          cy.getByLabel(this.orgType).click()
        })
        break;
      } 

    cy.clickByText('Save')
    cy.contains('Success! Organization information has been saved.').should('be.visible')
    cy.clickByText('Next')
  }

  inputFacilityInfo(appType) {
    switch (appType) {
      case 'group':
      case 'family':
        cy.contains('Facility Information')
        cy.getByLabel('Facility Name (as it appears on the Community Care and Assisted Living Act Licence)').typeAndAssert(this.facilityData.facilityName)
        cy.getByLabel('Year Facility Began Operation (YYYY)').typeAndAssert(this.facilityData.yearFacilityBegan)
        cy.contains('div', 'Is the Facility Street Address the same as the Organization Street Address?').within(()=> {
          cy.getByLabel('Yes').click()
        })
        cy.contains('div', 'Is the Facility Contact the same as the Organization Contact Information?').within(()=> {
          cy.getByLabel('Yes').click()
        })
        cy.getByLabel('Facility Licence Number').typeAndAssert(this.facilityData.facilityLicence)
        cy.getByLabel('Effective Date of Current Licence').typeAndAssert(this.facilityData.licenceEffectiveDate)
        cy.selectByLabel('Select Health Authority that Issued Licence', this.facilityData.healthAuthority)
        break;

      case 'groupOld':
        cy.contains('Facility Information')
        cy.getByLabel('Facility Name (as it appears on the Community Care and Assisted Living Act Licence)').typeAndAssert(this.facilityData.facilityName)
        cy.getByLabel('Year Facility Began Operation (YYYY)').typeAndAssert(this.facilityData.yearFacilityBegan)
        cy.getByLabel('Facility Street Address').typeAndAssert(this.orgInfo.streetAddress)
        cy.getByLabel('City/Town').typeAndAssert(this.orgInfo.city)
        cy.contains('Province')
        cy.get('input:disabled').should('have.value', 'BC')
        cy.getByLabel('Postal Code').typeAndAssert(this.orgInfo.postalCode)
        cy.getByLabel('Facility Contact Name').typeAndAssert(this.orgInfo.facilityContact)
        cy.getByLabel('Position').typeAndAssert(this.orgInfo.position)
        cy.getByLabel('Business Phone').typeAndAssert(this.orgInfo.phone)
        cy.getByLabel('Facility Email Address').typeAndAssert(this.orgInfo.email)
        cy.getByLabel('Facility Licence Number').typeAndAssert(this.facilityData.facilityLicence)
        cy.getByLabel('Effective Date of Current Licence').typeAndAssert(this.facilityData.licenceEffectiveDate)
        break;

      case 'familyOld':
        cy.contains('Information to Determine Eligibility')
        cy.getByLabel('Facility Name').typeAndAssert(this.facilityData.facilityName)
        cy.getByLabel('Facility Licence Number').typeAndAssert(this.facilityData.facilityLicence)
        cy.getByLabel('Effective Date of Current Licence').typeAndAssert(this.facilityData.licenceEffectiveDate)
        break;
    } 

    cy.contains('div', 'Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?').within(()=> {
      cy.getByLabel('No').click()
    })
    // TODO [CCFRI-6673] - Uncomment the line below once this bug is resolved 
    // cy.clickByText('Save')
    // cy.contains('Success! Facility information has been saved.').should('be.visible')
    cy.clickByText('Next')
  }

  

  licenceAndServiceDeliveryDetails(appType) {
    switch (appType) {
      case 'groupOld':
      case 'familyOld': 
        this.monthsClosed = this.licenceInfo.closedMonthsOld
        break;
      case 'group': 
      case 'family':
        this.monthsClosed = this.licenceInfo.closedMonths
        cy.contains('Facility Licence and Service Details')
        break;
    }
    cy.getByLabel("Maximum number of days per week you provide child care").typeAndAssert(this.licenceInfo.maxDaysPerWeek)
    cy.getByLabel("Maximum number of weeks per year you provide child care").typeAndAssert(this.licenceInfo.maxWeeksPerYear)
    cy.getByLabel("Facility hours of operation from").should('be.visible').typeAndAssert(this.licenceInfo.hoursFrom)
    cy.getByLabel("Facility hours of operation to").should('exist').typeAndAssert(this.licenceInfo.hoursTo)
    cy.getByLabel(this.licenceInfo.closedEntireMonths).check().should('be.checked')
    cy.getByLabel(this.monthsClosed[0]).check().should('be.checked')
    cy.getByLabel(this.monthsClosed[1]).check().should('be.checked')
    cy.getByLabel(this.monthsClosed[2]).check().should('be.checked')
  }

  groupLicenses(appType) {
    let licenceCategory
    switch (appType) {
      case 'group': 
        licenceCategory = this.facilityLicenceDetailsData.groupLicenceCategories
        Object.entries(licenceCategory).forEach(([category, value]) => {
          if (value.checked) {
            cy.getByLabel(category).check().should('be.checked')
            cy.getByLabel(`Maximum Number for ${category}`).typeAndAssert(value.max)
          }
        });
        break;

      case 'groupOld': 
        licenceCategory = this.facilityLicenceDetailsData.oldGroupLicenceCategories
        Object.entries(licenceCategory).forEach(([category, value]) => {
          if (value.checked) {
            if (category === "Multi-Age Child Care") {
              cy.getByLabel(`Maximum ${category}`).typeAndAssert(value.max);
            } else {
              cy.getByLabel(`Maximum Number for ${category}`).typeAndAssert(value.max);
            } 
          }
        });
        break;
    };

    cy.getByLabel("Maximum Licensed Capacity").typeAndAssert(this.maxLicensedCap)
    if (licenceCategory.Preschool?.checked) {
      Object.entries(this.preschoolSessions).forEach(([day, value]) => {
        cy.getByLabel(day).typeAndAssert(value);
      });
    }

    cy.contains('div', 'Is the facility located on school property?').within(()=> {
      cy.getByLabel('Yes').click()
    })

    this.schoolAgedCare.forEach(label => {
      cy.getByLabel(label).check().should('be.checked');
    });
  }

  familyLicences(appType) {
    let licenceCategory
    switch (appType) {
      case 'family': 
        licenceCategory = this.facilityLicenceDetailsData.familyLicenceCategories
        Object.entries(licenceCategory).forEach(([category, value]) => {
          if (value.checked) {
            cy.getByLabel(`${category}`).click()
            cy.getByLabel("Maximum Licensed Capacity").typeAndAssert(value.max)
            cy.contains('div', 'Enter maximum number of child care spaces you offer')
              .getByLabel('Maximum Number of Child Care Spaces')
              .typeAndAssert(this.maxChildCareSpaces)
          }
        });
        break;

      case 'familyOld': 
        licenceCategory = this.facilityLicenceDetailsData.oldFamilyLicenceCategories
        Object.entries(licenceCategory).forEach(([category, value]) => {
          if (value.checked) {
            cy.getByLabel(`${category}`).click()
            cy.contains('Licence type')
            cy.getByLabel("Maximum licensed capacity").typeAndAssert(value.max)
            cy.getByLabel('Maximum number of child care spaces you offer').typeAndAssert(this.maxChildCareSpaces)
          }
        });
        break;
    }
  }

  // NOTE: please implement offerExtendedHours for the new template. 
  offerExtendedHours(appType) {
    cy.contains('div', 'Do you regularly offer extended daily hours of child care (before 6 am, after 7 pm or overnight)?').within(()=> {
      cy.getByLabel(this.extendedHours).click()
    })

    let extendedHoursLicence
    switch (appType) {
      case 'familyOld':
        extendedHoursLicence = this.facilityLicenceDetailsData.oldFamilyLicenceCategoriesExtendedHours

        cy.getByLabel('Maximum number of spaces you offer extended hours of child care?').typeAndAssert(this.extendedMaxSpaces)
        break;
      case 'groupOld': 
        extendedHoursLicence = this.facilityLicenceDetailsData.oldGroupLicenceCategoriesExtendedHours
        break;
    }

    cy.getByLabel('Maximum number of days per week you offer extended hours of child care?').typeAndAssert(this.extendedMaxDays)
    cy.getByLabel('Maximum number of weeks per year you offer extended hours of child care?').typeAndAssert(this.extendedMaxWeeks)
    cy.contains('Write the maximum number of spaces you offer extended hours of child care for each type of service')
    cy.contains('.v-col-md-6','4 hours or less extended child care').within(()=> {
      Object.entries(extendedHoursLicence).forEach(([category, value]) => {
        cy.getByLabel(category).typeAndAssert(value.maxUnderFourHours)
      });
    })

    cy.contains('.v-col-md-6', 'More than 4 extended child care').within(()=> {
      Object.entries(extendedHoursLicence).forEach(([category, value]) => {
        // NOTE: Slight difference between character spacing for licence categories on less than vs. more than 4 hours extended child care
        if (category === "Group Child Care (School Age / School Age Care on School Grounds)") {
          category = "Group Child Care (School Age/ School Age Care on School Grounds)"
        }
        if (category === "Family Child Care (School Age / School Age Care on School Grounds)") {
          category = "Family Child Care (School Age/ School Age Care on School Grounds)"
        }
        cy.getByLabel(category).typeAndAssert(value.maxOverFourHours)
      })
    })
  
    cy.clickByText('Save')
    cy.contains('Application saved successfully.').should('be.visible')
    cy.clickByText('Next')
  }

  //TODO [CCFRI-6110] (Hedie-cgi) Add functionality to add multiple facilities
  addAnotherFacility() {
    cy.contains('You have successfully applied for CCOF for the following facilities:')
    cy.contains(this.facilityData.facilityName)
    cy.contains('button', 'No').click();
  }

  licenceUpload() {
    cy.contains('Licence Upload')
    const fileName = 'Sample500kb.pdf';
    cy.get('input[placeholder="Select your file"]')
      .attachFile(fileName)
    cy.contains('div', fileName)
    cy.contains('button', 'Next').should('have.class', 'blueButton').then(()=> {
      cy.contains('button', 'Save').should('have.class', 'blueButton')
      .clickByText('Save')
    })
    cy.contains('Changes Successfully Saved')
      .clickByText('Next')
  }
}

export const ccofApp = new CcofApplication()
