import FamilyFundingV1 from '@/components/applicationTemplates/v1/family/FamilyFunding.vue';
import vuetify from '@/plugins/vuetify';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(FamilyFundingV1, {
      global: {
        plugins: [pinia, vuetify],
      },
    });
  });
}

function getRadioGroup(labelText) {
  return cy.contains('label', labelText).closest('.v-radio-group');
}

function selectRadio(labelText, optionText) {
  getRadioGroup(labelText).within(() => {
    cy.contains('.v-radio', optionText).click();
  });
}

describe('<FamilyFundingV1 />', () => {
  beforeEach(() => {
    mountWithPinia();
  });

  it('should render Licence Type radio group', () => {
    getRadioGroup('Licence type').within(() => {
      cy.get('.v-radio').should('have.length', 3);
      cy.contains('Family child care');
      cy.contains('In-Home Multi-Age Child Care');
      cy.contains('Multi-Age Care');
    });
  });

  context('Closed Month Input', () => {
    const question = 'Are there months when ALL of the programs at this facility are closed for the entire month?';

    it('should render Yes/No options', () => {
      getRadioGroup(question).within(() => {
        cy.contains('.v-radio', 'Yes');
        cy.contains('.v-radio', 'No');
      });
    });

    it('should not render month checkboxes if "No" selected', () => {
      selectRadio(question, 'No');
      cy.contains('If YES, check all the applicable months:').should('not.be.visible');
      cy.contains('.v-input', 'Jan').should('not.exist');
    });

    it('should render month checkboxes if "Yes" selected', () => {
      selectRadio(question, 'Yes');
      cy.contains('If YES, check all the applicable months:').should('be.visible');

      for (const month of ['Jan', 'Jul', 'Dec']) {
        cy.contains('.v-input', month);
      }
    });
  });

  context('Extended Hours', () => {
    const question = 'Do you regularly offer extended daily hours of child care';

    it('should not render extra inputs if selecting No', () => {
      selectRadio(question, 'No');
      cy.contains('label', 'Maximum number of days per week you offer extended hours of child care?').should(
        'not.exist',
      );
    });

    it('should render additional inputs if selecting Yes', () => {
      selectRadio(question, 'Yes');

      const labels = [
        'Maximum number of days per week you offer extended hours of child care?',
        'Maximum number of weeks per year you offer extended hours of child care?',
      ];

      for (const label of labels) {
        cy.contains('label', label).should('be.visible');
      }
    });
  });

  it('should render max number of spaces card', () => {
    cy.contains('Write the maximum number of spaces you offer extended hours of child care for each type of service');
    cy.contains('More than 4 extended child care');
    cy.contains('4 hours or less extended child care')
      .closest('.v-container')
      .within(() => {
        cy.get('input').should('have.length', 8);
      });
  });
});
