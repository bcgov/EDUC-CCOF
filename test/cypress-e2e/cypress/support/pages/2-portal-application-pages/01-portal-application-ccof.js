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
        this.groupLicenceCategory = this.facilityLicenceDetailsData.groupLicenceCategories
        this.oldGroupLicenceCategories = this.facilityLicenceDetailsData.oldGroupLicenceCategories
        this.familyLicenceCategory = this.facilityLicenceDetailsData.familyLicenceCategories
        this.schoolProperty = this.facilityLicenceDetailsData.isOnSchoolProperty
        this.preschoolSessions = this.facilityLicenceDetailsData.PreschoolSessions
        this.maxLicensedCap = this.facilityLicenceDetailsData.maximumLicensedCapacity
        this.maxChildCareSpaces = this.facilityLicenceDetailsData.maxChildCareSpaces
        this.extendedHours = this.facilityLicenceDetailsData.offerExtendedHoursChildCare
        this.extendedMaxDays = this.facilityLicenceDetailsData.maxDaysPerWeekExtendedHours
        this.extendedMaxWeeks = this.facilityLicenceDetailsData.maxWeeksPerYearExtendedHours
        this.schoolAgedCare = this.facilityLicenceDetailsData.schoolAgedCareServiceDetails
        this.groupExtendedHours = this.facilityLicenceDetailsData.groupLicenceCategoriesExtendedHours
        this.addFacilityData = this.facilityLicenceDetailsData.addFacilityData.addAnotherFacility
    })
  }

  validateGroupUrl(path) {
    cy.url().should('include', `/${path}/organization`)
  }

  // TODO [CCFRI-6301] (Hedie-cgi) - Add paths for selecting other Organization Types (e.g. Sole Proprietorship)
  inputOrganizationInfo(typeName) {
    // Org Info
    cy.contains('Organization Information')
    cy.contains('Type of Organization').should('be.visible')
    cy.getByLabel(this.orgType[typeName]).click()
    cy.getByLabel('Legal Organization Name (as it appears in BC Registries and Online Services)').typeAndAssert(this.orgInfo.legalOrgName)
    cy.getByLabel('Incorporation Number (as it appears in BC Registries and Online Services)').typeAndAssert(this.orgInfo.incorporationNumber)
    
    // Mailing & Street Address
    cy.contains('Organization Mailing Address').should('be.visible')
    cy.getByLabel('Enter address manually').check().should('be.checked')
    cy.getByLabel('Mailing Address').typeAndAssert(this.orgInfo.streetAddress)
    cy.getByLabel('City/Town').typeAndAssert(this.orgInfo.city)
    cy.selectByLabel('Province', this.orgInfo.province)
    cy.getByLabel('Postal Code').typeAndAssert(this.orgInfo.postalCode)
    cy.contains('Organization Street Address same as Mailing Address').should('be.visible')
      .getByLabel('Yes').check()
      .should('be.checked')
    
    // Org Contact
    cy.contains('Organization Contact Information').should('be.visible')
    cy.getByLabel('Business Phone').typeAndAssert(this.orgInfo.phone)
    cy.getByLabel('Email Address').typeAndAssert(this.orgInfo.email)
    cy.clickByText('Save')
    cy.contains('Success! Organization information has been saved.').should('be.visible')
    cy.clickByText('Next')
  }

  inputOrganizationInfoOld(typeName) {
    // Org Info
    cy.contains('Organization Information')
    cy.getByLabel('Legal Name (first, middle and last) or Organization (as it appears in BC corporate Registry)').typeAndAssert(this.orgInfo.legalOrgName)
    cy.getByLabel('Incorporation Number (as it appears in BC Corporate Registry)').typeAndAssert(this.orgInfo.incorporationNumber)
    
    // Mailing & Street Address
    cy.contains('Organization Mailing Address').should('be.visible')
    cy.getByLabel('Mailing Address').typeAndAssert(this.orgInfo.streetAddress)
    cy.getByLabel('City/Town').typeAndAssert(this.orgInfo.city)
    cy.selectByLabel('Province', this.orgInfo.province)
    cy.getByLabel('Postal Code').typeAndAssert(this.orgInfo.postalCode)
    cy.contains('Organization Street Address same as Mailing Address').should('be.visible').click()
    
    // Org Contact
    cy.contains('Contact Information').should('be.visible')
    cy.getByLabel('Organization Contact Name').typeAndAssert(this.orgInfo.facilityContact)
    cy.getByLabel('Position').typeAndAssert(this.orgInfo.position)
    cy.contains('label', 'Business BCeID')
    cy.get('input:disabled').should('have.value', Cypress.env('PORTAL_USERNAME'))
    cy.getByLabel('Business Phone').typeAndAssert(this.orgInfo.phone)
    cy.getByLabel('E-mail Address of Signing Authority').typeAndAssert(this.orgInfo.email)

    // Org Type
    cy.contains('Type of Organization').should('be.visible')
    cy.getByLabel(this.orgType[typeName]).click()

    // Save
    cy.clickByText('Save')
    cy.contains('Success! Organization information has been saved.').should('be.visible')
    cy.clickByText('Next')
  }

  inputFacilityInfo() {
    // Facility Info
    cy.contains('Facility Information')
    cy.getByLabel('Facility Name (as it appears on the Community Care and Assisted Living Act Licence)').typeAndAssert(this.facilityData.facilityName)
    cy.getByLabel('Year Facility Began Operation (YYYY)').typeAndAssert(this.facilityData.yearFacilityBegan)
    cy.contains('div', 'Is the Facility Street Address the same as the Organization Street Address?').within(()=> {
      cy.getByLabel('Yes').click()
    })

    // Facility Contact
    cy.contains('div', 'Is the Facility Contact the same as the Organization Contact Information?').within(()=> {
      cy.getByLabel('Yes').click()
    })

    // Licence info
    cy.getByLabel('Facility Licence Number').typeAndAssert(this.facilityData.facilityLicence)
    cy.getByLabel('Effective Date of Current Licence').typeAndAssert(this.facilityData.licenceEffectiveDate)
    cy.selectByLabel('Select Health Authority that Issued Licence', this.facilityData.healthAuthority)
    
    // Previous CCOF enrollment 
    cy.contains('div', 'Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?').within(()=> {
      cy.getByLabel('No').click()
    })
    cy.clickByText('Save')
    cy.contains('Success! Facility information has been saved.').should('be.visible')
    cy.clickByText('Next')
  }

  inputFacilityInfoOld() {
    // Facility Info
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

    // Licence info
    cy.getByLabel('Facility Licence Number').typeAndAssert(this.facilityData.facilityLicence)
    cy.getByLabel('Effective Date of Current Licence').typeAndAssert(this.facilityData.licenceEffectiveDate)
    
    // Previous CCOF enrollment 
    cy.contains('div', 'Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?').within(()=> {
      cy.getByLabel('No').click()
    })
    cy.clickByText('Save')
    cy.contains('Success! Facility information has been saved.').should('be.visible')
    cy.clickByText('Next')
  }

  licenceAndServiceDeliveryDetails() {
    cy.contains('Facility Licence and Service Details')
    cy.getByLabel("Maximum number of days per week you provide child care").typeAndAssert(this.licenceInfo.maxDaysPerWeek)
    cy.getByLabel("Maximum number of weeks per year you provide child care").typeAndAssert(this.licenceInfo.maxWeeksPerYear)
    cy.getByLabel("Facility hours of operation from").should('be.visible').typeAndAssert(this.licenceInfo.hoursFrom)
    cy.getByLabel("Facility hours of operation to").should('exist').typeAndAssert(this.licenceInfo.hoursTo)
    cy.getByLabel(this.licenceInfo.closedEntireMonths).check().should('be.checked')
    cy.getByLabel(this.licenceInfo.closedMonths[0]).check().should('be.checked')
    cy.getByLabel(this.licenceInfo.closedMonths[1]).check().should('be.checked')
    cy.getByLabel(this.licenceInfo.closedMonths[2]).check().should('be.checked')
  }

  licenceAndServiceDeliveryDetailsOld(){
    cy.getByLabel("Maximum number of days per week you provide child care").typeAndAssert(this.licenceInfo.maxDaysPerWeek)
    cy.getByLabel("Maximum number of weeks per year you provide child care").typeAndAssert(this.licenceInfo.maxWeeksPerYear)
    cy.getByLabel("Facility hours of operation from").should('be.visible').typeAndAssert(this.licenceInfo.hoursFrom)
    cy.getByLabel("Facility hours of operation to").should('exist').typeAndAssert(this.licenceInfo.hoursTo)
    cy.getByLabel(this.licenceInfo.closedEntireMonths).check().should('be.checked')
    cy.getByLabel(this.licenceInfo.closedMonthsOld[0]).check().should('be.checked')
    cy.getByLabel(this.licenceInfo.closedMonthsOld[1]).check().should('be.checked')
    cy.getByLabel(this.licenceInfo.closedMonthsOld[2]).check().should('be.checked')
  }

  groupLicenses() {
    // Licence Types & Capacities
    Object.entries(this.groupLicenceCategory).forEach(([category, value]) => {
      if (value.checked) {
        cy.getByLabel(category).check().should('be.checked');
        cy.getByLabel(`Maximum number for ${category}`).typeAndAssert(value.max);
      }
    });
    cy.getByLabel("Maximum Licensed Capacity").typeAndAssert(this.maxLicensedCap)
    if (this.groupLicenceCategory.Preschool.checked) {
      Object.entries(this.preschoolSessions).forEach(([day, value]) => {
        cy.getByLabel(day).typeAndAssert(value);
      });
    }

    // School Property
    cy.get('div[label="Is the facility located on school property?"]')
      .find('label')
      .contains(this.schoolProperty)
      .click()
    this.schoolAgedCare.forEach(label => {
      cy.getByLabel(label).check().should('be.checked');
    });
  }

  groupLicensesOld() {
    // Licence Types & Capacities
    cy.getByLabel("Maximum Licensed Capacity").typeAndAssert(this.maxLicensedCap)
    Object.entries(this.oldGroupLicenceCategories).forEach(([category, value]) => {
      if (category === "Multi-Age Child Care") {
        cy.getByLabel(`Maximum ${category}`).typeAndAssert(value.max);
      } else {
        cy.getByLabel(`Maximum Number for ${category}`).typeAndAssert(value.max);
      }
    });

    // Preschool
    cy.contains('Preschool')
    Object.entries(this.preschoolSessions).forEach(([day, value]) => {
      cy.getByLabel(day).typeAndAssert(value);
    })

    // School Property
    cy.contains('div', 'Is the facility located on school property?').within(()=> {
      cy.getByLabel('Yes').click()
    })
    this.schoolAgedCare.forEach(label => {
      cy.getByLabel(label).check().should('be.checked');
    });
    
  }

  familyLicences(licenceType) {
    // Licence Types & Capacities
    const familyLicence = this.familyLicenceCategory[licenceType]
    cy.getByLabel(familyLicence.name).click()
    cy.getByLabel("Maximum Licensed Capacity").typeAndAssert(familyLicence.max)
    cy.contains('div', 'Enter maximum number of child care spaces you offer')
      .getByLabel('Maximum Number of Child Care Spaces')
      .typeAndAssert(this.maxChildCareSpaces)
  }

  offerExtendedHours() {
    cy.contains('div', 'Do you regularly offer extended hours of child care (care before 6:00 AM, after 7:00 PM, or overnight service)?').within(()=> {
      cy.getByLabel(this.extendedHours).click()
    })

    if (this.extendedHours === "Yes") {
      cy.getByLabel("Maximum number of days per week you offer extended hours of child care?").typeAndAssert(this.extendedMaxDays)
      cy.getByLabel("Maximum number of weeks per year you offer extended hours of child care?").typeAndAssert(this.extendedMaxWeeks)

      // Group Application - Extended Hours (uses group licences)
      if (this.groupExtendedHours){
        Object.entries(this.groupExtendedHours).forEach(([category, value]) => {
          if (value.checked) {
            cy.getByLabel(category).check().should('be.checked');
            cy.getByLabel(`Maximum number for ${category}`).typeAndAssert(value.max);
          }
        });
      } else {
        // Family Application - Extended Hours (uses family licence)
        cy.contains('Enter the number of spaces for which you offer extended hours (care before 6:00 AM, after 7:00 PM or overnight service regularly offered')
        cy.getByLabel(category).should('be.checked')
        cy.contains('div', '4 hous or less extended child care').within(()=> {
          cy.getByLabel('Maximum Spaces Offered').typeAndAssert(category.maxUnderFourHours);
        })
        cy.contains('div', 'Over 4 hours extended child care').within(()=> {
          cy.getByLabel('Maximum Spaces Offered').typeAndAssert(category.maxOverFourHours)
        })
      }
    }
    cy.clickByText('Save')
    cy.contains('Application saved successfully.').should('be.visible')
    cy.clickByText('Next')
  }

  offerExtendedHoursOld() {
    cy.contains('div', 'Do you regularly offer extended daily hours of child care (before 6 am, after 7 pm or overnight)?').within(()=> {
      cy.getByLabel(this.extendedHours).click()
    })

    if (this.extendedHours === "Yes") {
      cy.getByLabel('Maximum number of days per week you offer extended hours of child care?').typeAndAssert(this.extendedMaxDays)
      cy.getByLabel('Maximum number of weeks per year you offer extended hours of child care?').typeAndAssert(this.extendedMaxWeeks)
      cy.contains('Write the maximum number of spaces you offer extended hours of child care for each type of service')
      cy.contains('.v-col-md-6','4 hours or less extended child care').within(()=> {
        // Group Application - Extended Hours (uses group licences)
        if (this.groupExtendedHours){
          Object.entries(this.oldGroupLicenceCategories).forEach(([category, value]) => {
            if (value.checked) {
              cy.getByLabel(category).typeAndAssert(value.maxUnderFourHours)
            }
          });
        } else {
          // Family Application - Extended Hours (uses family licence)
          // TODO - Add for Template 1
        }
      })

      cy.contains('.v-col-md-6', 'More than 4 extended child care').within(()=> {
        // Group Application - Extended Hours (uses group licences)
        if (this.groupExtendedHours){
          Object.entries(this.oldGroupLicenceCategories).forEach(([category, value]) => {
            if (value.checked) {
              if (category === "Group Child Care (School Age / School Age Care on School Grounds)") {
                category = "Group Child Care (School Age/ School Age Care on School Grounds)"
              }
              cy.getByLabel(category).typeAndAssert(value.maxOverFourHours)
            }
          });
        } else {
          // Family Application - Extended Hours (uses family licence)
          // TODO - Add for Template 1
        }
      })
    }
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
