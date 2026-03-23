class ApprovableFeeSchedule {
  loadFixtures(file) {
    return cy.fixture(`/ccfri-data/${file}`).then((data) => {
      this.iAccept = data.afs?.iAccept || "I accept";
    });
  }

  loadFixturesAndVariables(file) {
    return this.loadFixtures(file);
  }

  accept(value = null) {
    const effectiveValue = value ?? this.iAccept;

    cy.get(`input[type="radio"][aria-label="${effectiveValue}"]`, {
      timeout: 10000,
    })
      .should("exist")
      .check({ force: true });
  }

  save() {
    cy.clickByText("Save");
    cy.contains("Success!").should("be.visible");
  }

  next() {
    cy.clickByText("Next");
  }

  completeAfsPage(value = null) {
    this.accept(value);
    this.save();
    this.next();
  }
}

export const approvableFeeSchedule = new ApprovableFeeSchedule();
