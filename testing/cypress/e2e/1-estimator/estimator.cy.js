const ESTIMATOR_URL = Cypress.env("ESTIMATOR_URL");

//todo - change estimator URL to DEV env when done testing. Currently on localhost!

describe("CCFRI Estimator Test", () => {
  beforeEach(() => {
    cy.visit(ESTIMATOR_URL);

    cy.get("button").contains("Parent").click();
  });

  // Reusable function to find and select a facility
  const findAndSelectFacility = (facilityName) => {
    cy.get('[data-cy="facilitySearch"]').type(facilityName);
    cy.get("button").contains("Search").click();
    cy.get("button").contains("Select").click();
  };

  const searchableFacility = "sunny";

  it("Find Facility", () => {
    cy.on("uncaught:exception", () => false); // Ignore ResizeObserver error
    findAndSelectFacility(searchableFacility);
    findAndSelectFacility("bunny");
  });

  it("No facility to find", () => {
    cy.on("uncaught:exception", () => false);

    const facilityNameSearch = "hdfoadijsdughiuhd";

    cy.get('[data-cy="facilitySearch"]').type(facilityNameSearch);
    cy.get("button").contains("Search").click();

    cy.get("span")
      .contains("No facilities were found matching your search criteria.")
      .click();
  });

  it("Check Care Schedule with Facility ", () => {
    cy.on("uncaught:exception", () => false);
    findAndSelectFacility(searchableFacility);

    cy.get('[data-cy="childAgeCategoryDropdown"]').click();

    //the dropdown is hard to target when it's open. These values come from CRM - is it safe to assume they would be there?
    cy.get(".v-list").should("have.length.greaterThan", 0);
  });

  //todo- add tests without facility selected
});
