class OrganizationClosure {
  loadFixtures(file) {
    return cy.fixture(`/closure-data/${file}`).then((data) => {
      this.facilityName = data.facilityName;
      this.parentsPayForClosure = data.parentsPayForClosure;
      this.isFullFacilityClosure = data.isFullFacilityClosure;
      this.closureStartDate = data.closureStartDate;  
      this.closureEndDate = data.closureEndDate;
      this.reason = data.reason;
      this.requestDescription = data.requestDescription;
    });
  }

  loadFixturesAndVariables(file) {
    return this.loadFixtures(file);
  }

  openNewClosureDialog() {
    cy.contains("Add New Closure").clickByText("Add New Closure");
    cy.contains("div", "New Closure Request").should("be.visible");
  }

  selectFacility(facilityName = null) {
    // Wait for the facility input to be visible and ready
    cy.get('input[placeholder="Select a facility"]', { timeout: 15000 })
      .should("be.visible")
      .should("not.be.disabled");

    // Wait a moment for the dialog to fully settle
    cy.wait(1500);

    // Click the input to open dropdown
    cy.get('input[placeholder="Select a facility"]')
      .click({ force: true })
      .then(() => {
        cy.log("Input clicked, waiting for dropdown");
      });

    // Wait for the overlay and list to appear
    cy.get(".v-overlay-container", { timeout: 15000 }).should("exist");

    if (facilityName) {
      cy.contains(".v-list-item", facilityName, { timeout: 15000 })
        .scrollIntoView({ block: "center" })
        .click({ force: true });
    } else {
      cy.get(".v-list-item", { timeout: 15000 })
        .should("have.length.greaterThan", 0)
        .first()
        .then(($item) => {
          cy.log("Found facility item, clicking it");
          cy.wrap($item).click({ force: true });
        });
    }

    // Wait for dropdown to close
    cy.wait(1000);
  }

  selectParentsPayAndClosureDates(
    parentsWillPay = null,
    isFullClosure = null,
    startDate = null,
    endDate = null,
  ) {
    const effectiveParentsPay = parentsWillPay ?? this.parentsPayForClosure;
    const effectiveFullClosure = isFullClosure ?? this.isFullFacilityClosure;
    const effectiveStartDate = startDate ?? this.closureStartDate;
    const effectiveEndDate = endDate ?? this.closureEndDate;

    const parentsPayLabel =
      effectiveParentsPay === true || effectiveParentsPay === "Yes"
        ? "Yes"
        : "No";
    const fullClosureLabel =
      effectiveFullClosure === true || effectiveFullClosure === "Yes"
        ? "Yes"
        : "No";

    cy.contains("h3", "Will parents pay for this closure?")
      .closest(".v-row")
      .within(() => {
        cy.contains(".v-label", parentsPayLabel)
          .scrollIntoView({ block: "center" })
          .click({ force: true });
      });

    cy.contains("h3", "Is this a full facility closure?", { timeout: 15000 })
      .closest(".v-row")
      .within(() => {
        cy.contains(".v-label", fullClosureLabel)
          .scrollIntoView({ block: "center" })
          .click({ force: true });
      });

    cy.contains("h3", "Dates:", { timeout: 15000 }).should("exist");

    cy.get('input[type="date"]', { timeout: 15000 })
      .its("length")
      .should("be.gte", 2);

    cy.get('input[type="date"]')
      .first()
      .scrollIntoView({ block: "center" })
      .clear({ force: true })
      .type(effectiveStartDate, { force: true })
      .trigger("input", { force: true })
      .trigger("change", { force: true })
      .blur();

    cy.get('input[type="date"]')
      .last()
      .scrollIntoView({ block: "center" })
      .clear({ force: true })
      .type(effectiveEndDate, { force: true })
      .trigger("input", { force: true })
      .trigger("change", { force: true })
      .blur();
  }

  enterReason(reason = null) {
    const normalizedReason = String(reason ?? this.reason ?? "").trim();

    if (!normalizedReason) {
      throw new Error(
        'Closure reason is empty. Ensure fixture field "reason" is populated before submit.',
      );
    }

    cy.contains("h3", "Reason:")
      .parents(".v-row")
      .first()
      .find(".v-text-field input")
      .first()
      .scrollIntoView({ block: "center" })
      .should("not.be.disabled")
      .click({ force: true })
      .clear({ force: true })
      .type(normalizedReason, { force: true })
      .should("have.value", normalizedReason);
  }

  enterRequestDescription(description = null) {
    const normalizedDescription = String(
      description ?? this.requestDescription ?? "",
    ).trim();

    cy.contains("h3", "Request Description:")
      .nextAll(".v-input")
      .first()
      .find("textarea")
      .first()
      .scrollIntoView({ block: "center" })
      .click({ force: true })
      .clear({ force: true })
      .then(($field) => {
        if (normalizedDescription.length === 0) {
          cy.wrap($field).should("have.value", "");
          return;
        }

        cy.wrap($field)
          .type(normalizedDescription, { force: true })
          .should("have.value", normalizedDescription);
      });
  }

  validateDeclarationContent() {
    cy.contains("Declaration and Submission", { timeout: 20000 })
      .scrollIntoView({ block: "center" })
      .should("exist");
    cy.contains("By submitting this Closure Request, I confirm that:").should(
      "exist",
    );

    cy.contains("The information provided in this request is true").should(
      "exist",
    );
    cy.contains(
      "I am authorized to submit Closure Requests for this facility",
    ).should("exist");
    cy.contains("the Ministry relies on the content of these requests").should(
      "exist",
    );
    cy.contains(
      "I will maintain proper records regarding this facility",
    ).should("exist");
    cy.contains("I will not charge parent fees for any closure days").should(
      "exist",
    );
  }

  submitClosureRequest() {
    cy.get("body", { timeout: 30000 })
      .find(".v-overlay__scrim:visible")
      .should("have.length", 0);

    cy.contains("button", "Accept and Submit", { timeout: 30000 })
      .scrollIntoView({ block: "center" })
      .should("be.visible")
      .should(($button) => {
        expect($button).not.to.have.attr("disabled");
        expect($button).not.to.have.class("v-btn--disabled");
      })
      .click({ force: true });
  }

  handleSuccessDialog() {
    cy.contains("Success").should("be.visible");
    cy.contains("Your request has been submitted.").should("be.visible");
    cy.contains("button", "Return to Closures").should("be.visible").click();
  }

  validateClosureInList(facilityName = null, expectedStatus = "Pending") {
    // Verify we're on the Organization Closures page
    cy.contains("Organization Closures").should("be.visible");

    // Verify a closure appears in the table with expected status
    cy.get("table tbody tr").should("have.length.greaterThan", 0);

    // Validate the first row has the expected status
    cy.get("table tbody tr")
      .first()
      .within(() => {
        cy.contains(expectedStatus).should("be.visible");
      });

    cy.contains(Cypress.env("PORTAL_USERNAME")).click();
    cy.contains("Logout").click();
  }

  createNewClosure(
    facilityName = null,
    parentsWillPay = null,
    isFullClosure = null,
    startDate = null,
    endDate = null,
    reason = null,
    description = null,
    supportingDocs = null,
  ) {
    this.openNewClosureDialog();
    this.selectFacility(facilityName ?? this.facilityName);
    this.selectParentsPayAndClosureDates(
      parentsWillPay,
      isFullClosure,
      startDate,
      endDate,
    );
    this.enterReason(reason);
    this.enterRequestDescription(description);
    this.validateDeclarationContent();
    this.submitClosureRequest();
    this.handleSuccessDialog();
    this.validateClosureInList(facilityName);
  }

  fillClosureForm(
    facilityName = null,
    parentsWillPay = null,
    isFullClosure = null,
    startDate = null,
    endDate = null,
    reason = null,
    description = null,
    supportingDocs = null,
  ) {
    this.selectFacility(facilityName ?? this.facilityName);
    this.selectParentsPayAndClosureDates(
      parentsWillPay,
      isFullClosure,
      startDate,
      endDate,
    );
    this.enterReason(reason);
    this.enterRequestDescription(description);
  }
}

export const organizationClosure = new OrganizationClosure();
