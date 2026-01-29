class SubmitApplication {
  summaryAndDeclaration(appType, changeRequestType = null) {
    cy.url().should("include", "/summary-declaration");

    // Submit App
    cy.contains("Summary and Declaration").should("be.visible");
    if (appType.includes("Renewal")) {
      cy.getByLabel(
        "I do hereby certify that I am the authorized signing authority and that all of the information provided is true and complete to the best of my knowledge and belief.",
      ).click();
    } else {
      cy.getByLabel(
        "I, the applicant, do hereby certify that all the information provided is true and complete to the best of my knowledge and belief. By clicking this check-box, I indicate that I agree to the foregoing terms and conditions.",
      ).click();
    }
    cy.getByLabel(
      "Your Organization's Authorized Signing Authority",
    ).typeAndAssert("Luffy");
    cy.clickByText("Submit");
    cy.contains("Submission Complete");
    cy.clickByText("Return to your dashboard");
    cy.url().should("equal", Cypress.env("PORTAL_BASE_URL"));

    const isRenewal = appType.includes("Renewal");
    const isChangeRequest = appType.includes("ChangeRequest");

    if (isChangeRequest) {
      // Common navigation for all change requests
      cy.clickByText("Request a change");
      cy.contains("Child Care Operating Funding Program");
      cy.url().should("include", `/change/landing#change-request-history`);

      // Map change request types to their display names
      const changeRequestTypeMap = {
        AddNewFacility: "Add new facility(s)",
        ReportOtherChanges: "Report other changes",
        MidTermFeeIncrease: "Mid-Term Fee Increase",
      };

      // Validate the change request in the table
      const displayName = changeRequestTypeMap[changeRequestType];
      if (displayName) {
        // Find the row containing both the display name and "Submitted" status
        cy.get(".v-data-table tbody tr").each(($row) => {
          cy.wrap($row)
            .invoke("text")
            .then((text) => {
              if (text.includes(displayName) && text.includes("Submitted")) {
                cy.wrap($row).within(() => {
                  cy.get("td").eq(0).should("contain", displayName);
                  cy.get("td").eq(3).should("contain", "Submitted");
                });
              }
            });
        });
      }
    } else if (isRenewal) {
      cy.contains("Renew my Funding Agreement").wrap(() => {
        cy.get(".smallCardDisabled").should("exist");
      });
    } else {
      cy.contains(
        ".v-card",
        "Apply for Child Care Operating Funding (CCOF) including:",
      ).should("contain", "Status: Submitted");
      cy.contains(
        ".v-card",
        "Child Care Fee Reduction Initiative (CCFRI) Status: SUBMITTED",
      ).should(
        "contain",
        "Early Childhood Educator Wage Enhancement (ECE-WE) Status: SUBMITTED",
      );
    }
    cy.contains(Cypress.env("PORTAL_USERNAME")).click();
    cy.contains("Logout").click();
  }
}

export const submitApp = new SubmitApplication();
