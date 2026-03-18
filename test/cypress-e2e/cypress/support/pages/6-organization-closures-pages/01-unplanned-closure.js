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
      this.removeReason = data.removeReason ?? data.reason;
      this.expectedAddStatus = data.expectedAddStatus ?? "Pending";
      this.expectedUpdateStatus = data.expectedUpdateStatus ?? "Cancelled";
    });
  }

  loadFixturesAndVariables(file) {
    return this.loadFixtures(file);
  }

  openNewClosureDialog() {
    cy.clickByText("Add New Closure");
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
    // Confirmation dialog may show an overlay that can momentarily appear above the dialog content.
    // Use existence rather than visibility so tests are resilient to transient layering issues.
    cy.contains("Success").should("exist");

    // Click the return button even if it is temporarily covered by a scrim/overlay.
    cy.contains("button", "Return to Closures", { timeout: 30000 })
      .should("exist")
      .click({ force: true });

    cy.url().should("include", "closures");
  }

  openRemoveClosureDialog() {
    cy.contains("button", "Remove", { timeout: 20000 })
      .scrollIntoView({ block: "center" })
      .should("be.visible")
      .should("not.be.disabled")
      .click({ force: true });

    cy.get(".v-overlay--active .v-overlay__content", { timeout: 20000 })
      .last()
      .within(() => {
        cy.contains("Remove Closure Request", { timeout: 20000 }).should(
          "exist",
        );
      });
  }

  enterReasonForClosureRemoval(reason = null) {
    const normalizedReason = String(reason ?? this.removeReason ?? "").trim();

    if (!normalizedReason) {
      throw new Error(
        'Removal reason is empty. Ensure fixture field "removeReason" is populated before submit.',
      );
    }

    cy.get(".v-overlay--active .v-overlay__content", { timeout: 20000 })
      .last()
      .within(() => {
        cy.contains("h3", "Reason for closure removal:", { timeout: 20000 })
          .should("exist")
          .then(($heading) => {
            $heading[0].scrollIntoView({ block: "center", behavior: "smooth" });

            cy.wrap($heading)
              .parent()
              .find("textarea")
              .first()
              .should("exist")
              .should("not.be.disabled")
              .click({ force: true })
              .clear({ force: true })
              .type(normalizedReason, { force: true })
              .should("have.value", normalizedReason);
          });
      });
  }

  submitRemoveClosureRequest() {
    cy.get(".v-overlay--active .v-overlay__content", { timeout: 30000 })
      .last()
      .within(() => {
        cy.contains("button", /remove closure/i, { timeout: 30000 })
          .scrollIntoView({ block: "center" })
          .should("exist")
          .should(($button) => {
            expect($button).not.to.have.attr("disabled");
            expect($button).not.to.have.class("v-btn--disabled");
          })
          .click({ force: true });
      });

    cy.contains("Success", { timeout: 30000 }).should("exist");
    cy.contains("button", "Return to Closures", { timeout: 30000 })
      .should("exist")
      .click({ force: true });
    cy.url().should("include", "closures");
  }

  validateClosureInList(facilityName = null, expectedStatus = "Pending") {
    // Verify we're on the Organization Closures page
    cy.contains("Organization Closures").should("be.visible");

    // Verify a closure appears in the table with expected status
    cy.get("table tbody tr").should("have.length.greaterThan", 0);

    // Validate expected status for the selected facility row when available.
    if (facilityName) {
      cy.contains("table tbody tr", facilityName, { timeout: 30000 })
        .should("exist")
        .within(() => {
          cy.contains(expectedStatus).should("be.visible");
        });
    } else {
      cy.contains("table tbody tr", expectedStatus, { timeout: 30000 }).should(
        "exist",
      );
    }

    cy.contains(Cypress.env("PORTAL_USERNAME")).click();
    cy.contains("Logout").click();
  }

  validateClosureStatusPresent(expectedStatus = "Cancelled", attemptsLeft = 8) {
    cy.contains("Organization Closures", { timeout: 30000 }).should("exist");
    cy.get("table tbody tr", { timeout: 30000 }).should(
      "have.length.greaterThan",
      0,
    );

    if (this.facilityName) {
      cy.contains("table tbody tr", this.facilityName, { timeout: 30000 })
        .should("exist")
        .then(($row) => {
          const rowText = ($row.text() || "").toLowerCase();
          const expected = expectedStatus.toLowerCase();

          if (rowText.includes(expected)) {
            cy.wrap($row).within(() => {
              cy.contains(expectedStatus).should("be.visible");
            });
            return;
          }

          if (attemptsLeft <= 1) {
            throw new Error(
              `Expected status "${expectedStatus}" for facility "${this.facilityName}" after retries, but last row content was: ${$row.text()}`,
            );
          }

          cy.wait(10000);
          cy.reload();
          this.validateClosureStatusPresent(expectedStatus, attemptsLeft - 1);
        });
      return;
    }

    cy.contains("table tbody tr", expectedStatus, { timeout: 30000 }).should(
      "exist",
    );
  }

  createNewClosure(
    facilityName = null,
    parentsWillPay = null,
    isFullClosure = null,
    startDate = null,
    endDate = null,
    reason = null,
    description = null,
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
    this.validateClosureInList(
      facilityName ?? this.facilityName,
      this.expectedAddStatus ?? "Pending",
    );
  }

  fillClosureForm(
    facilityName = null,
    parentsWillPay = null,
    isFullClosure = null,
    startDate = null,
    endDate = null,
    reason = null,
    description = null,
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

  openUpdateClosureDialog() {
    cy.contains("button", "Update", { timeout: 15000 })
      .scrollIntoView({ block: "center" })
      .should("be.visible")
      .should("not.be.disabled")
      .click({ force: true });

    cy.contains("Update Closure Request", { timeout: 15000 }).should(
      "be.visible",
    );
  }

  selectNewClosureDates(startDate = null, endDate = null) {
    const effectiveStartDate = startDate ?? this.closureStartDate;
    const effectiveEndDate = endDate ?? this.closureEndDate;

    cy.get('input[type="date"]:not(:disabled)', { timeout: 15000 })
      .should("have.length.gte", 2)
      .first()
      .scrollIntoView({ block: "center" })
      .clear({ force: true })
      .type(effectiveStartDate, { force: true })
      .trigger("input", { force: true })
      .trigger("change", { force: true })
      .blur();

    cy.get('input[type="date"]:not(:disabled)')
      .last()
      .scrollIntoView({ block: "center" })
      .clear({ force: true })
      .type(effectiveEndDate, { force: true })
      .trigger("input", { force: true })
      .trigger("change", { force: true })
      .blur();
  }

  updateClosureRequest(
    startDate = null,
    endDate = null,
    reason = null,
    description = null,
  ) {
    this.openUpdateClosureDialog();
    this.selectNewClosureDates(startDate, endDate);
    this.enterReason(reason);
    this.enterRequestDescription(description);
    this.validateDeclarationContent();
    this.submitClosureRequest();
    this.validateClosureStatusPresent(this.expectedUpdateStatus ?? "Cancelled");
    cy.contains(Cypress.env("PORTAL_USERNAME")).click();
    cy.contains("Logout").click();
  }

  removeClosureRequest(reason = null) {
    this.openRemoveClosureDialog();
    this.enterReasonForClosureRemoval(reason);
    this.validateDeclarationContent();
    this.submitRemoveClosureRequest();
    cy.contains(Cypress.env("PORTAL_USERNAME")).click();
    cy.contains("Logout").click();
  }
}

export const organizationClosure = new OrganizationClosure();
