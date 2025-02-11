describe("Estimator-test", () => {
  it("Test1-Accessing Estimator", () => {
    cy.visit("http://localhost:8082/");
    cy.title().should("eq", "My ChildCareBC Services");
    cy.contains("button", "Estimator").click();
  });

  it("Test2-Facility-Search-Positive", () => {
    cy.visit("http://localhost:8082/");
    cy.title().should("eq", "My ChildCareBC Services");
    cy.contains("button", "Estimator").click();
    cy.contains("button", "Parent").click();
    cy.get('input[type="text"]').eq(0).type("LITTLE LEARNERS{enter}");
    cy.contains("button", "Select").first().click();
    cy.wait(3000);
    cy.contains("Optional Facility Search").should("be.visible");
    cy.get('input[type="text"]').eq(0).should("have.value", "LITTLE LEARNERS");
  });

  it("Test3-Facility-Search-Negative", () => {
    cy.visit("http://localhost:8082/");
    cy.title().should("eq", "My ChildCareBC Services");
    cy.contains("button", "Estimator").click();
    cy.contains("button", "Parent").click();
    cy.get('input[type="text"]').eq(0).type("Doesn't exists{enter}");
    cy.contains("button", "Select").first().click();
    cy.wait(3000);
    cy.contains("Optional Facility Search").should("be.visible");
    cy.get('input[type="text"]')
      .eq(0)
      .should("not.have.value", "Doesn't exists");
  });
});
