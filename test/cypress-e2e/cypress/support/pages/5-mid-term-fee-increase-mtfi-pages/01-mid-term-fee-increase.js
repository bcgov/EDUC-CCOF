class ChangeRequestMtfi {
  loadFixtures(file) {
    return cy.fixture(`/ccfri-data/${file}`).then((data) => {
      this.parentFees = data.parentFees;
      this.facilityName = data.facilityName;
    });
  }

  loadFixturesAndVariables(file) {
    this.loadFixtures(file);
  }

  enterFeeDataFacilities(files, appType = "group") {
    cy.url().should("contain", "/mtfi/mtfi-instructions");
    cy.contains("div", "Welcome to CCOF!").should("be.visible");
    cy.contains("button", "Next").should("have.class", "blueButton");
    cy.clickByText("Next");

    // Facility selection is only for group applications
    if (appType === "group" || appType === "groupOld") {
      cy.url().should("contain", "/mtfi-select-facility");
      cy.contains(
        "div",
        "Please select which facility you would like to update",
      ).should("be.visible");

      // Click the checkbox to select facility
      cy.contains(".v-card", this.facilityName).within(() => {
        cy.get('input[type="checkbox"][id^="checkbox-"]')
          .first()
          .check({ force: true });
      });

      cy.contains("button", "Next").should("have.class", "blueButton");
      cy.clickByText("Next");
    }

    // Verify facility name is on the page
    cy.contains(this.facilityName);

    // Click "Auto-fill approved parent fees" button for all parent fee cards
    cy.get('button:contains("Auto-fill approved parent fees")').each(($btn) => {
      cy.wrap($btn).click();
    });

    //Save and proceed
    cy.contains("button", "Save").should("have.class", "blueButton").click();
    cy.contains("Success! CCFRI Parent fees have been saved.");
    cy.contains("button", "Next").should("have.class", "blueButton");
    cy.clickByText("Next");
  }
}

export const reportMtfiChange = new ChangeRequestMtfi();
