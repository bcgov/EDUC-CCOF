import FacilityInformation from '@/components/ccofApplication/family/FacilityInformation.vue';
import vuetify from '@/plugins/vuetify';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(FacilityInformation, {
      global: {
        plugins: [pinia, vuetify],
      },
    });
  });
}

describe('<FacilityInformation />', () => {
  it('should render eligibility form', () => {
    mountWithPinia({});
    cy.contains('Information to Determine Eligibility');
    cy.get('.v-text-field').should('have.length', 3);
    cy.get('.v-radio').should('have.length', 2);
  });
  context('FacilityInformationV2', () => {
    it('should render FacilityInformationV2', () => {
      mountWithPinia({
        application: { applicationTemplateVersion: '2' },
      });
      cy.contains('Information to Determine Eligibility').should('not.exist');
    });

    it('should render inputs', () => {
      mountWithPinia({
        application: { applicationTemplateVersion: '2' },
      });
      cy.contains('label', 'Facility Name (as it appears on the Community Care');
      cy.contains('label', 'Year Facility Began Operation (YYYY)');
    });

    it('should render radio buttons', () => {
      mountWithPinia({
        application: { applicationTemplateVersion: '2' },
      });

      cy.contains('.v-radio-group', 'Is the Facility Street Address the same as the Organization').within(() => {
        cy.get('.v-radio').eq(0).should('have.text', 'Yes');
        cy.get('.v-radio').eq(0).should('have.text', 'Yes');
      });

      cy.contains('.v-radio-group', 'Is the Facility Contact the same as the Organization').within(() => {
        cy.get('.v-radio').eq(0).should('have.text', 'Yes');
        cy.get('.v-radio').eq(1).should('have.text', 'No');
      });
    });

    it('should render license inputs', () => {
      mountWithPinia({
        application: { applicationTemplateVersion: '2' },
      });

      cy.contains('label', 'Facility Licence Number');
    });
  });
});
