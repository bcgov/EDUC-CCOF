class NewAndModifiedFacilities {
  loadFixtures(file) {
    return cy.fixture(`ccfri-data/${file}`).then((data) => {
      this.appliedForNewSpacesFunding = data.nmf.appliedForNewSpacesFunding;
      this.providesAdditionalServices = data.nmf.providesAdditionalServices;
      this.providesTransportation = data.nmf.providesTransportation;
      this.additionalInformation = data.nmf.additionalInformation;
    });
  }

  loadFixturesAndVariables(file) {
    return this.loadFixtures(file);
  }

  selectYesNoByQuestion(questionText, value) {
    const label = value === true || value === "Yes" ? "Yes" : "No";

    cy.contains("p", questionText)
      .next()
      .within(() => {
        cy.contains("label", label)
          .scrollIntoView({ block: "center" })
          .click({ force: true });
      });
  }

  answerNmfQuestions(
    appliedForNewSpacesFunding = null,
    providesAdditionalServices = null,
    providesTransportation = null,
  ) {
    const effectiveApplied =
      appliedForNewSpacesFunding ?? this.appliedForNewSpacesFunding;

    const effectiveServices =
      providesAdditionalServices ?? this.providesAdditionalServices;

    const effectiveTransportation =
      providesTransportation ?? this.providesTransportation;

    this.selectYesNoByQuestion(
      "Did you apply for Ministry funding to create new licensed spaces prior to April 1, 2021",
      effectiveApplied,
    );

    this.selectYesNoByQuestion(
      "Does your facility provide additional services",
      effectiveServices,
    );

    this.selectYesNoByQuestion(
      "Do you provide transportation to/from your facility",
      effectiveTransportation,
    );
  }

  enterAdditionalInformation(text = null) {
    const normalizedText = String(
      text ?? this.additionalInformation ?? "",
    ).trim();

    cy.get("textarea")
      .scrollIntoView({ block: "center" })
      .clear({ force: true });

    if (normalizedText.length > 0) {
      cy.get("textarea")
        .type(normalizedText, { force: true })
        .should("have.value", normalizedText);
    }
  }

  fillNmfPage(
    appliedForNewSpacesFunding = null,
    providesAdditionalServices = null,
    providesTransportation = null,
    additionalInformation = null,
  ) {
    this.answerNmfQuestions(
      appliedForNewSpacesFunding,
      providesAdditionalServices,
      providesTransportation,
    );

    this.enterAdditionalInformation(additionalInformation);
  }

  save() {
    cy.clickByText("Save");
    cy.contains("Success! RFI information has been saved.");
  }

  next() {
    cy.clickByText("Next");
  }

  completeNmfPage(
    appliedForNewSpacesFunding = null,
    providesAdditionalServices = null,
    providesTransportation = null,
    additionalInformation = null,
  ) {
    this.fillNmfPage(
      appliedForNewSpacesFunding,
      providesAdditionalServices,
      providesTransportation,
      additionalInformation,
    );

    this.save();
    this.next();
  }
}

export const newAndModifiedFacilities = new NewAndModifiedFacilities();
