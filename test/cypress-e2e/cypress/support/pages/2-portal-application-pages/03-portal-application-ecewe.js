function optInAndUnionize(attr, opt, union, csseaMember, facilityName) {
  cy.contains(facilityName, { timeout: 10000 }).should("exist");
  cy.contains(attr, facilityName).within(() => {
    cy.contains("label", opt).click();
    if (opt === "Opt-In" && csseaMember === "Yes") {
      cy.contains("label", union).click();
    }
  });
}

class EceWeApplication {
  loadFixtures(file) {
    // This pathing was incorrect. All ECE-WE fixtures are located within the /ecewe-data directory.
    return cy.fixture(`/ecewe-data/${file}`).then((data) => {
      // Only set properties that are present in the fixture to avoid overwriting org-level data.
      if (data.cssea) {
        this.cssea = data.cssea;
      }
      if (data.publicSectorEmployer) {
        this.publicSectorEmployer = data.publicSectorEmployer;
      }
      if (data.optInOrOut) {
        this.optInOrOut = data.optInOrOut;
      }
      if (data.facility) {
        this.facility = data.facility;
      }
      // Return for chaining.
      return data;
    });
  }

  loadFixturesAndVariables(file) {
    // Chain off the promise returned by loadFixtures to ensure data is loaded before proceeding.
    return this.loadFixtures(file).then((fixtureData) => {
      // Org-level data might not be in every fixture, so guard access.
      if (fixtureData.cssea) {
        this.csseaMember = fixtureData.cssea.csseaMember;
        this.csseaSelection = fixtureData.cssea.status;
        this.fundingType = fixtureData.cssea.fundingModel;
        this.unionStatus = fixtureData.cssea.unionStatus;
      }
      // Return for chaining.
      return fixtureData;
    });
  }

  optInEceWe(term) {
    cy.contains("Early Childhood Educator Wage Enhancement (ECE-WE)").should(
      "be.visible"
    );
    cy.contains(
      ".v-card",
      `For the ${term} funding term, would you like to opt-in to ECE-WE for any facility in your organization?`
    )
      .getByLabel(`${this.optInOrOut}`)
      .click();
  }

  groupEceWe(appType, files) {
    // Opt-In Path
    if (this.optInOrOut === "Yes") {
      cy.contains(
        ".v-card",
        "Are you a public sector employer, as defined in the Public Sector Employers Act?"
      ).within(() => {
        cy.getByLabel(this.publicSectorEmployer).click();
      });
      cy.contains("Which of the following describes your organization?").should(
        "be.visible"
      );
      cy.getByLabel(this.csseaSelection).click();
      // CSSEA Non-Member
      if (this.csseaMember === "No") {
        cy.getByLabel(this.unionStatus).click();
        // CSSEA Non-Member + Union
        if (
          this.unionStatus === "Some or all of our facilities are unionized."
        ) {
          cy.clickByText(this.cssea.confirmation);
        }
      } else {
        if (appType.includes("Old")) {
          cy.contains(this.fundingType).click();
        }
        cy.getByLabel(this.cssea.confirmation).click();
      }

      cy.clickByText("Save");
      cy.contains("Success! ECEWE application has been saved.").should(
        "be.visible"
      );
      cy.clickByText("Next");

      // Opt In Facilities
      optInAndUnionize(
        ".v-card",
        this.facility.facilityOptInOrOut,
        this.facility.facilityUnionStatus,
        this.csseaMember,
        this.facility.facilityName,
      );
      if (files) {
        cy.wrap(files).each((file) => {
          // Use .then() to prevent race conditions, ensuring fixture data is loaded before use.
          this.loadFixturesAndVariables(`extra-facs-ecewe/${file}`).then((fixtureData) => {
            optInAndUnionize(
              ".v-card",
              fixtureData.facility.facilityOptInOrOut,
              fixtureData.facility.facilityUnionStatus,
              this.csseaMember,
              fixtureData.facility.facilityName,
            );
          });
        });
      }
    }
    // Opt-Out Path
    cy.clickByText("Save");
    cy.clickByText("Next");
  }

  groupEceWeChangeRequest(appType, files) {
    // Opt-In Path
    cy.intercept("GET", "**/application/ecewe/**").as("getEcewe");
    cy.wait("@getEcewe", { timeout: 15000 }).then(() => {
    cy.wait(500); // Small wait for DOM to update after data loads
    cy.clickByText("Next");
    });

    // Opt In Facilities
    optInAndUnionize(
      ".v-card",
      this.facility.facilityOptInOrOut,
      this.facility.facilityUnionStatus,
      this.csseaMember,
      this.facility.facilityName,
    );
    if (files) {
      cy.wrap(files).each((file) => {
        // Use .then() to prevent race conditions, ensuring fixture data is loaded before use.
        this.loadFixturesAndVariables(`extra-facs-ecewe/${file}`).then((fixtureData) => {
          optInAndUnionize(
            ".v-card",
            fixtureData.facility.facilityOptInOrOut,
            fixtureData.facility.facilityUnionStatus,
            this.csseaMember,
            fixtureData.facility.facilityName,
          );
        });
      });
    }

    // Opt-Out Path
    cy.clickByText("Save");
    cy.clickByText("Next");
  }

  familyEceWe() {
    cy.then(() => {
      cy.clickByText("Save");
      cy.contains("Success! ECEWE application has been saved").should(
        "be.visible"
      );
      cy.clickByText("Next");
      // Opt-In Path
      if (this.optInOrOut === "Yes") {
        cy.contains(
          "On the previous page, you indicated that you would like to opt-in to ECE-WE for any facility in your organization"
        );
        cy.clickByText("Save");
        cy.contains(
          "Success! ECEWE Facility applications have been saved."
        ).should("be.visible");
        cy.clickByText("Next");
      }
    });
  }

  supportingDocUpload() {
    cy.contains("Supporting Document Upload").should("be.visible");
    cy.clickByText("Next");
  }
}

export const eceWeApp = new EceWeApplication();
