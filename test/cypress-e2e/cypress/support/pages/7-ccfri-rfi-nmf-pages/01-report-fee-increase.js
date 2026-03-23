class ReportFeeIncrease {
  loadFixtures(file) {
    return cy.fixture(`/ccfri-data/${file}`).then((data) => {
      this.parentFeeIncreaseRfi = data.parentFeeIncreaseRfi;

      this.exceptionalCircumstances =
        data.parentFeeIncreaseRfi.exceptionalCircumstances;
      this.feeIncreaseDueToWage =
        data.parentFeeIncreaseRfi.feeIncreaseDueToWage;
      this.feeIncreaseExtendedHours =
        data.parentFeeIncreaseRfi.feeIncreaseExtendedHours;
      this.IndigenousConnection =
        data.parentFeeIncreaseRfi.IndigenousConnection;
      this.underservedPop = data.parentFeeIncreaseRfi.underservedPop;
    });
  }

  loadFixturesAndVariables(file) {
    return this.loadFixtures(file);
  }

  selectRadioByName(name, value) {
    cy.get(`input[name="${name}"][aria-label="${value}"]`, { timeout: 10000 })
      .should("exist")
      .check({ force: true });
  }

  answerExceptionalCircumstances(value = null) {
    const effectiveValue = value ?? this.exceptionalCircumstances;
    this.selectRadioByName("exceptionalCircumstances", effectiveValue);
  }

  answerFeeIncreaseDueToWage(value = null) {
    const effectiveValue = value ?? this.feeIncreaseDueToWage;
    this.selectRadioByName("feeIncreaseDueToWage", effectiveValue);
  }

  answerFeeIncreaseExtendedHours(value = null) {
    const effectiveValue = value ?? this.feeIncreaseExtendedHours;
    this.selectRadioByName("feeIncreaseExtendedHours", effectiveValue);
  }

  answerIndigenousConnection(value = null) {
    const effectiveValue = value ?? this.IndigenousConnection;
    this.selectRadioByName("IndigenousConnection", effectiveValue);
  }

  answerUnderservedPop(value = null) {
    const effectiveValue = value ?? this.underservedPop;
    this.selectRadioByName("underservedPop", effectiveValue);
  }

  fillParentFeeIncreaseRfi(
    exceptionalCircumstances = null,
    feeIncreaseDueToWage = null,
    feeIncreaseExtendedHours = null,
    IndigenousConnection = null,
    underservedPop = null,
  ) {
    this.answerExceptionalCircumstances(exceptionalCircumstances);
    this.answerFeeIncreaseDueToWage(feeIncreaseDueToWage);
    this.answerFeeIncreaseExtendedHours(feeIncreaseExtendedHours);
    this.answerIndigenousConnection(IndigenousConnection);
    this.answerUnderservedPop(underservedPop);
  }

  save() {
    cy.clickByText("Save");
    cy.contains("Success! Request for Information has been saved.").should(
      "be.visible",
    );
  }

  next() {
    cy.clickByText("Next");
  }

  completeRfiPage(
    exceptionalCircumstances = null,
    feeIncreaseDueToWage = null,
    feeIncreaseExtendedHours = null,
    IndigenousConnection = null,
    underservedPop = null,
  ) {
    this.fillParentFeeIncreaseRfi(
      exceptionalCircumstances,
      feeIncreaseDueToWage,
      feeIncreaseExtendedHours,
      IndigenousConnection,
      underservedPop,
    );
    this.save();
    this.next();
  }
}

export const reportFeeIncrease = new ReportFeeIncrease();
