class ChangeRequestLicence {
  uploadLicenceServiceChange() {
    cy.url().should("contain", "/notification-dialogue");
    cy.contains("div", "Funding Agreement Change Notification").should(
      "be.visible",
    );
    cy.contains("button", "Next").should("have.class", "blueButton");
    cy.clickByText("Next");
    cy.url().should("contain", "/notification-form");
    cy.contains("div", "Change Notification Form").should("be.visible");

    // Upload the completed Change Notification Form document
    let changeNotificationFiles = [];
    cy.get('button[id="add-new-file"]').should("be.visible").first().click();

    cy.task(
      "countFiles",
      "cypress/fixtures/changerequest-data/change-notification-file",
    ).then((files) => {
      changeNotificationFiles = files;

      cy.get('input[placeholder="Select your file"]')
        .should("have.length", changeNotificationFiles.length)
        .each((input, index) => {
          cy.log(changeNotificationFiles.length);
          let currFile = `changerequest-data/change-notification-file/${changeNotificationFiles[index]}`;
          cy.wrap(input).attachFile(currFile);
          cy.contains(`${changeNotificationFiles[index]}`);
        });

      //Upload supporting documents for your requested changes.
      cy.get('button[id="add-new-file"]').should("be.visible").eq(1).click();
      let supportingDocumentFiles = [];
      cy.task(
        "countFiles",
        "cypress/fixtures/changerequest-data/supporting-doc-file",
      ).then((files) => {
        supportingDocumentFiles = files;
        cy.get('input[placeholder="Select your file"]')
          .eq(changeNotificationFiles.length)
          .each((input, index) => {
            cy.log(supportingDocumentFiles.length);
            let currFile = `changerequest-data/supporting-doc-file/${supportingDocumentFiles[index]}`;
            cy.wrap(input).attachFile(currFile);
            cy.contains(`${supportingDocumentFiles[index]}`);
          });

        //Save and proceed
        cy.contains("button", "Save")
          .should("have.class", "blueButton")
          .click();
        cy.contains("Success! Request for Information has been saved.");
        cy.contains("button", "Next")
          .should("have.class", "blueButton")
          .click();
      });
    });
  }
}

export const reportLicenceChange = new ChangeRequestLicence();
