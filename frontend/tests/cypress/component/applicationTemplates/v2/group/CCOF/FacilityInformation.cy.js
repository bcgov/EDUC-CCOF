import FacilityInformationV2 from '@/components/applicationTemplates/v2/group/CCOF/FacilityInformation.vue';
import vuetify from '@/plugins/vuetify';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(FacilityInformationV2, {
      global: {
        plugins: [pinia, vuetify],
      },
    });
  });
}

describe('<FacilityInformationV2 />', () => {
  it('should render component header', () => {
    mountWithPinia();
    cy.contains('h3', 'Facility Information');
  });

  it('should render default inputs', () => {
    mountWithPinia();
    cy.contains('label', 'Facility Name (as it appears on the Community Care and Assisted Living Act Licence)');
    cy.contains('label', 'Year Facility Began Operation (YYYY)');
    cy.contains('label', 'Facility Licence Number');
    cy.contains('label', 'Effective Date of Current Licence');
    cy.contains('label', 'Select Health Authority that Issued Licence');
  });

  it('should render facility address form', () => {
    mountWithPinia();
    cy.contains('Is the Facility Contact the same as the Organization Contact Information?');
  });

  it('should render facility contact form', () => {
    mountWithPinia();
    cy.contains('Is the Facility Street Address the same as the Organization Street Address?');
  });

  it('should render radio group', () => {
    mountWithPinia();

    cy.contains('Has this facility or you as the applicant ever received funding under the')
      .closest('.v-radio-group')
      .within(() => {
        cy.get('.v-radio').should('have.length', 3);
        cy.contains(
          'Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?',
        );
        cy.contains('No');
        cy.contains('Yes');
        cy.contains('Yes, as facility');
      });
  });
});
