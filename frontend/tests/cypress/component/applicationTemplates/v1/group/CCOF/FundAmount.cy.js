import FundAmount from '@/components/applicationTemplates/v1/group/CCOF/FundAmount.vue';
import vuetify from '@/plugins/vuetify';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(FundAmount, {
      global: {
        plugins: [pinia, vuetify],
      },
    });
  });
}

describe('<FundAmount /> -- V1', () => {
  beforeEach(() => {
    mountWithPinia();
  });

  context('Closed Month Input', () => {
    it('should render input asking if program closed for any month', () => {
      cy.contains(
        'label',
        'Are there months when ALL of the programs at this facility are closed for the entire month?',
      )
        .closest('.v-radio-group')
        .within(() => {
          cy.contains('.v-radio', 'Yes');
          cy.contains('.v-radio', 'No');
        });
    });

    it('should not render month checkboxes if selected `No` to if all programs closed', () => {
      cy.contains(
        'label',
        'Are there months when ALL of the programs at this facility are closed for the entire month?',
      )
        .closest('.v-radio-group')
        .within(() => {
          cy.contains('.v-radio', 'Yes');
          cy.contains('.v-radio', 'No').click();
        });
      cy.contains('If YES, check all the applicable months:').should('not.be.visible');
      cy.contains('.v-input', 'Jan').should('not.exist');
    });

    it('should render month checkboxes if selected `Yes` to if all programs closed', () => {
      cy.contains(
        'label',
        'Are there months when ALL of the programs at this facility are closed for the entire month?',
      )
        .closest('.v-radio-group')
        .within(() => {
          cy.contains('.v-radio', 'Yes').click();
          cy.contains('.v-radio', 'No');
        });
      cy.contains('If YES, check all the applicable months:').should('be.visible');
      cy.contains('.v-input', 'Jan');
      cy.contains('.v-input', 'Jul');
      cy.contains('.v-input', 'Dec');
    });
  });

  it('should render preschool session inputs if max preschool number is non zero', () => {
    cy.contains('label', 'Maximum Number for Preschool')
      .closest('.v-input')
      .within(() => {
        cy.get('input').type(5);
      });

    cy.contains('Preschool');
    cy.contains('Please indicate how many preschool sessions your facility offers per day')
      .closest('.v-card')
      .within(() => {
        cy.get('input[type="number"').should('have.length', 6);
      });
  });

  it('should not render preschool session inputs if max preschool number is zero', () => {
    cy.contains('label', 'Maximum Number for Preschool')
      .closest('.v-input')
      .within(() => {
        cy.get('input').type(0);
      });

    cy.contains('Please indicate how many preschool sessions your facility offers per day').should('not.exist');
  });

  it('should calculate total sum of preschool sessions per day', () => {
    cy.contains('label', 'Maximum Number for Preschool')
      .closest('.v-input')
      .within(() => {
        cy.get('input').type(1);
      });

    cy.contains('Please indicate how many preschool sessions your facility offers per day')
      .closest('.v-card')
      .within(() => {
        cy.get('input[type="number"').eq(0).type(1);
        cy.get('input[type="number"').eq(1).type(1);
        cy.get('input[type="number"').eq(2).type(2);
        cy.get('input[type="number"').eq(3).type(2);
        cy.get('input[type="number"').eq(4).type(2);

        cy.get('input[type="number"').eq(5).should('have.value', '8');
      });
  });

  context('Group Child Care School', () => {
    it('should render group child care input if max group child care school number is non zero', () => {
      cy.contains('label', 'Maximum Number for Group Child Care (School Age / School Age Care on School Grounds)')
        .closest('.v-input')
        .within(() => {
          cy.get('input').type(5);
        });

      cy.contains('label', 'Is the facility located on school property?')
        .closest('.v-radio-group')
        .within(() => {
          cy.contains('Yes');
          cy.contains('No');
        });
    });

    it('should render facility service offering inputs if selecting `Yes` for school property', () => {
      cy.contains('label', 'Maximum Number for Group Child Care (School Age / School Age Care on School Grounds)')
        .closest('.v-input')
        .within(() => {
          cy.get('input').type(5);
        });

      cy.contains('label', 'Is the facility located on school property?')
        .closest('.v-radio-group')
        .within(() => {
          cy.get('.v-radio').eq(0).click();
        });

      cy.contains('Group Child Care (School Age Care on School Grounds)');
      cy.contains('Please indicate each service that your facility offers');
      cy.contains('label', 'Before School');
      cy.contains('label', 'After School');
      cy.contains('label', 'Before Kindergarten');
      cy.contains('label', 'After Kindergarten');
    });

    it('should not render facility service offering inputs if selecting `No` for school property', () => {
      cy.contains('label', 'Maximum Number for Group Child Care (School Age / School Age Care on School Grounds)')
        .closest('.v-input')
        .within(() => {
          cy.get('input').type(5);
        });

      cy.contains('label', 'Is the facility located on school property?')
        .closest('.v-radio-group')
        .within(() => {
          cy.get('.v-radio').eq(1).click();
        });

      cy.contains('Group Child Care (School Age Care on School Grounds)').should('not.be.visible');
    });
  });

  context('Extended Hours', () => {
    it('should not render additional inputs if selecting `No` for extended hours offering', () => {
      cy.contains('label', 'Do you regularly offer extended daily hours of child care')
        .closest('.v-radio-group')
        .within(() => {
          cy.contains('Yes');
          cy.contains('No');
          cy.get('.v-radio').eq(1).click();
        });

      cy.contains('label', 'Maximum number of days per week you offer extended hours of child care?').should(
        'not.be.visible',
      );
    });

    it('should render additional inputs if selecting `Yes` for extended hours offering', () => {
      cy.contains('label', 'Do you regularly offer extended daily hours of child care')
        .closest('.v-radio-group')
        .within(() => {
          cy.get('.v-radio').eq(0).click();
        });

      cy.contains('label', 'Maximum number of days per week you offer extended hours of child care?').should(
        'be.visible',
      );

      cy.contains('label', 'Maximum number of weeks per year you offer extended hours of child care?').should(
        'be.visible',
      );
    });
  });
});
