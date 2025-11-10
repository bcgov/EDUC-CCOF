import FundAmount from '@/components/applicationTemplates/v2/group/CCOF/FundAmount.vue';
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

describe('<FundAmount /> -- V2', () => {
  context('Closed Month', () => {
    it('should render full closed months checkboxes if `Yes` to closed month', () => {
      mountWithPinia();
      cy.contains(
        'label',
        'Are there months when ALL of the programs at this facility are closed for the entire month?',
      )
        .closest('.v-radio-group')
        .within(() => {
          cy.get('.v-radio').eq(0).click();
        });

      cy.contains('div', 'If YES, check all the fully closed months:');
      cy.contains('label', 'January');
      cy.contains('label', 'December');
    });

    it('should not render full closed months checkboxes if `No` to closed month', () => {
      mountWithPinia();
      cy.contains(
        'label',
        'Are there months when ALL of the programs at this facility are closed for the entire month?',
      )
        .closest('.v-radio-group')
        .within(() => {
          cy.get('.v-radio').eq(1).click();
        });

      cy.contains('div', 'If YES, check all the fully closed months:').should('not.exist');
      cy.contains('label', 'January').should('not.exist');
      cy.contains('label', 'December').should('not.exist');
    });
  });

  context('License Category', () => {
    it('should render under 36 months input when checkbox selected', () => {
      mountWithPinia();
      cy.contains('label', 'Group Child Care (Under 36 Months)').closest('.v-checkbox').click();
      cy.contains('label', 'Maximum Number for Group Child Care (Under 36 Months)');
    });

    it('should not render under 36 months input when checkbox unselected', () => {
      mountWithPinia();
      cy.contains('label', 'Maximum Number for Group Child Care (Under 36 Months)').should('not.exist');
    });

    it('should render 30 months to school age input when checkbox selected', () => {
      mountWithPinia();
      cy.contains('label', 'Group Child Care (30 Months to School Age)').closest('.v-checkbox').click();
      cy.contains('label', 'Maximum Number for Group Child Care (30 Months to School Age)');
    });

    it('should not render 30 months to school age input when checkbox unselected', () => {
      mountWithPinia();
      cy.contains('label', 'Maximum Number for Group Child Care (30 Months to School Age)').should('not.exist');
    });

    it('should render school age input when checkbox selected', () => {
      mountWithPinia();
      cy.contains('label', 'Group Child Care (School Age)').closest('.v-checkbox').click();
      cy.contains('label', 'Maximum Number for Group Child Care (School Age)');
    });

    it('should not render school age input when checkbox unselected', () => {
      mountWithPinia();
      cy.contains('label', 'Maximum Number for Group Child Care (School Age)').should('not.exist');
    });

    it('should render care on school grounds input when checkbox selected', () => {
      mountWithPinia();
      cy.contains('label', 'School Age Care on School Grounds').closest('.v-checkbox').click();
      cy.contains('label', 'Maximum Number for School Age Care on School Grounds');
    });

    it('should not render care on school grounds input when checkbox unselected', () => {
      mountWithPinia();
      cy.contains('label', 'Maximum Number for School Age Care on School Grounds').should('not.exist');
    });

    it('should render preschool input when checkbox selected', () => {
      mountWithPinia();
      cy.get('#preschool-checkbox').click();
      cy.contains('label', 'Maximum Number for Preschool');
    });

    it('should not render preschool input when checkbox unselected', () => {
      mountWithPinia();
      cy.contains('label', 'Maximum Number for Preschool').should('not.exist');
    });

    it('should render multi-age input when checkbox selected', () => {
      mountWithPinia();
      cy.get('#multi-age-checkbox').click();
      cy.contains('label', 'Maximum Number for Multi-Age Child Care');
    });

    it('should not render multi-age input when checkbox unselected', () => {
      mountWithPinia();
      cy.contains('label', 'Maximum Number for Multi-Age Child Care').should('not.exist');
    });
  });

  it('should render licensed capcity input', () => {
    mountWithPinia();
    cy.get('#multi-age-checkbox').click();
    cy.contains('label', 'Maximum Licensed Capacity');
  });

  it('should not render licensed capcity input when no license category', () => {
    mountWithPinia();
    cy.contains('label', 'Maximum Licensed Capacity').should('not.exist');
  });

  it('should render additional preschool sessions when preschool selected as license', () => {
    mountWithPinia();
    cy.get('#preschool-checkbox').click();
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

  it('should render additional school age inputs when school age care selected as license', () => {
    mountWithPinia();
    cy.get('#schoolage-care-checkbox').click();
    cy.contains('Please indicate each service that your facility offers');
    cy.contains('label', 'Before School');
    cy.contains('label', 'After School');
    cy.contains('label', 'Before Kindergarten');
    cy.contains('label', 'After Kindergarten');
  });

  context('Extended Hours', () => {
    it('should render additional inputs if selecting `Yes` for extended hours offering', () => {
      mountWithPinia();

      cy.contains(
        'label',
        'Do you regularly offer extended hours of child care (care before 6:00 AM, after 7:00 PM, or overnight service)?',
      )
        .closest('.v-radio-group')
        .within(() => {
          cy.contains('Yes');
          cy.contains('No');
          cy.get('.v-radio').eq(0).click();
        });

      cy.contains('label', 'Maximum number of days per week you offer extended hours of child care?').should(
        'be.visible',
      );
      cy.contains('label', 'Maximum number of weeks per year you offer extended hours of child care?').should(
        'be.visible',
      );
    });

    it('should not render additional inputs if selecting `No` for extended hours offering', () => {
      mountWithPinia();

      cy.contains(
        'label',
        'Do you regularly offer extended hours of child care (care before 6:00 AM, after 7:00 PM, or overnight service)?',
      )
        .closest('.v-radio-group')
        .within(() => {
          cy.get('.v-radio').eq(1).click();
        });

      cy.contains('label', 'Maximum number of days per week you offer extended hours of child care?').should(
        'not.exist',
      );
    });

    context('Extended Hours Specific License Category', () => {
      function selectExtendedOption() {
        cy.contains(
          'label',
          'Do you regularly offer extended hours of child care (care before 6:00 AM, after 7:00 PM, or overnight service)?',
        )
          .closest('.v-radio-group')
          .within(() => {
            cy.get('.v-radio').eq(0).click();
          });
      }

      it('should render under 36 months extended inputs when selected', () => {
        mountWithPinia();
        selectExtendedOption();

        cy.get('#under-36months-extendedCC-checkbox').click();
        cy.contains('4 hours or less extended child care');
        cy.contains('Over 4 hours extended child care');
      });

      it('should not render under 36 months extended inputs when unselected', () => {
        mountWithPinia();
        selectExtendedOption();
        cy.contains('4 hours or less extended child care').should('not.exist');
      });

      it('should render 30 months to school age extended inputs when selected', () => {
        mountWithPinia();
        selectExtendedOption();

        cy.get('#30months-to-schoolage-extendedCC-checkbox').click();
        cy.contains('4 hours or less extended child care');
        cy.contains('Over 4 hours extended child care');
      });

      it('should render school age care extended inputs when selected', () => {
        mountWithPinia();
        selectExtendedOption();

        cy.get('#schoolage-care-extendedCC-checkbox').click();
        cy.contains('4 hours or less extended child care');
        cy.contains('Over 4 hours extended child care');
      });

      it('should render care on school grounds extended inputs when selected', () => {
        mountWithPinia();
        selectExtendedOption();

        cy.get('#care-on-school-grounds-extendedCC-checkbox').click();
        cy.contains('4 hours or less extended child care');
        cy.contains('Over 4 hours extended child care');
      });

      it('should render multi age extended inputs when selected', () => {
        mountWithPinia();
        selectExtendedOption();

        cy.get('#multi-age-extendedCC-checkbox').click();
        cy.contains('4 hours or less extended child care');
        cy.contains('Over 4 hours extended child care');
      });
    });
  });
});
