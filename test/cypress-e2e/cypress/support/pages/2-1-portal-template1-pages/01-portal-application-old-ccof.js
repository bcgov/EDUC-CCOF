import 'cypress-file-upload';

class CcofApplicationOld {
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

  // TODO [CCFRI-6301] (Hedie-cgi) - Add paths for selecting other Organization Types (e.g. Sole Proprietorship)
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
    cy.contains('Organization Street Address same as Mailing Address').click()
    
    // Org Contact
    cy.contains('Contact Information').should('be.visible')
    cy.getByLabel('Organization Contact Name').typeAndAssert(this.orgInfo.facilityContact)
    cy.getByLabel('Position').typeAndAssert(this.orgInfo.position)
    cy.get('Business BCeID').contains(Cypress.env("PORTAL_USERNAME"))
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

  inputFacilityInfoOld() {
    // Facility Info
    cy.contains('Facility Information')
    cy.getByLabel('Facility Name (as it appears on the Community Care and Assisted Living Act Licence)').typeAndAssert(this.facilityData.facilityName)
    cy.getByLabel('Year Facility Began Operation (YYYY)').typeAndAssert(this.facilityData.yearFacilityBegan)
    cy.getByLabel('Facility Street Address').typeAndAssert(this.orgInfo.streetAddress)
    cy.getByLabel('City/Town').typeAndAssert(this.orgInfo.city)
    cy.get('Province').should('contain', 'BC')
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

  groupLicensesOld() {
    // Licence Types & Capacities
    Object.entries(this.oldGroupLicenceCategories).forEach(([category, value]) => {
       cy.getByLabel(category).typeAndAssert(value);
    });

    cy.contains('Preschool').within(()=> {
        Object.entries(this.preschoolSessions).forEach(([day, value]) => {
        cy.getByLabel(day).typeAndAssert(value);
      });
    })

    // School Property
    cy.contains('div', 'Is the facility located on school property?').within(()=> {
        cy.getByLabel('Yes').click()
        this.schoolAgedCare.forEach(label => {
            cy.getByLabel(label).check().should('be.checked');
        });
    })
    
  }

  familyLicencesOld(licenceType) {
    // Licence Types & Capacities
    const familyLicence = this.familyLicenceCategory[licenceType]
    cy.getByLabel(familyLicence.name).click()
    cy.getByLabel("Maximum Licensed Capacity").typeAndAssert(familyLicence.max)
    cy.contains('div', 'Enter maximum number of child care spaces you offer')
      .getByLabel('Maximum Number of Child Care Spaces')
      .typeAndAssert(this.maxChildCareSpaces)
  }

  offerExtendedHoursOld() {
    cy.contains('div', 'Do you regularly offer extended hours of child care (care before 6:00 AM, after 7:00 PM, or overnight service)?').within(()=> {
      cy.getByLabel(this.extendedHours).click()
    })

    if (this.extendedHours === "Yes") {
        cy.getByLabel('Maximum number of days per week you offer extended hours of child care?').typeAndAssert(this.extendedMaxDays)
        cy.getByLabel('Maximum number of weeks per year you offer extended hours of child care?').typeAndAssert(this.extendedMaxWeeks)
        cy.contains('Write the maximum number of spaces you offer extended hours of child care for each type of service')
        cy.contains('v-col-md-6', '4 hours of less extended child care').within(()=> {
            // Group Application - Extended Hours (uses group licences)
            if (this.groupExtendedHours){
                Object.entries(this.groupExtendedHours).forEach(([category, value]) => {
                    if (value.checked) {
                        cy.getByLabel(category).typeAndAssert(value.maxUnderFourHours)
                    }
                });
            } else {
                // Family Application - Extended Hours (uses family licence)
                // TODO - Add for Template 1
            }
        })

        cy.contains('v-col-md-6', 'More than 4 extended child care').within(()=> {
            // Group Application - Extended Hours (uses group licences)
            if (this.groupExtendedHours){
                Object.entries(this.groupExtendedHours).forEach(([category, value]) => {
                    if (value.checked) {
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
}

export const ccofAppOld = new CcofApplicationOld()
