import FundAmount from '@/components/applicationTemplates/v2/group/CCOF/FundAmount.vue';
import vuetify from '@/plugins/vuetify';

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
  beforeEach(() => {
    mountWithPinia();
  });
  context('Closed Month', () => {
    it('should render full closed months checkboxes if `Yes` to closed month', () => {
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
    const categories = [
      {
        label: 'Group Child Care (Under 36 Months)',
        maxLabel: 'Maximum Number for Group Child Care (Under 36 Months)',
      },
      {
        label: 'Group Child Care (30 Months to School Age)',
        maxLabel: 'Maximum Number for Group Child Care (30 Months to School Age)',
      },
      {
        label: 'Group Child Care (School Age)',
        maxLabel: 'Maximum Number for Group Child Care (School Age)',
      },
      {
        label: 'School Age Care on School Grounds',
        maxLabel: 'Maximum Number for School Age Care on School Grounds',
      },
      {
        selector: '#preschool-checkbox',
        label: 'Preschool',
        maxLabel: 'Maximum Number for Preschool',
      },
      {
        selector: '#multi-age-checkbox',
        label: 'Multi-Age Child Care',
        maxLabel: 'Maximum Number for Multi-Age Child Care',
      },
    ];

    categories.forEach(({ label, selector, maxLabel }) => {
      const clickTarget = selector
        ? () => cy.get(selector).click()
        : () => cy.contains('label', label).closest('.v-checkbox').click();

      it(`should render input when "${label}" checkbox selected`, () => {
        clickTarget();
        cy.contains('label', maxLabel);
      });

      it(`should not render input when "${label}" checkbox unselected`, () => {
        cy.contains('label', maxLabel).should('not.exist');
      });
    });
  });

  it('should render licensed capcity input', () => {
    cy.get('#multi-age-checkbox').click();
    cy.contains('label', 'Maximum Licensed Capacity');
  });

  it('should not render licensed capcity input when no license category', () => {
    cy.contains('label', 'Maximum Licensed Capacity').should('not.exist');
  });

  it('should render additional preschool sessions when preschool selected as license', () => {
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
    cy.get('#schoolage-care-checkbox').click();
    cy.contains('Please indicate each service that your facility offers');
    cy.contains('label', 'Before School');
    cy.contains('label', 'After School');
    cy.contains('label', 'Before Kindergarten');
    cy.contains('label', 'After Kindergarten');
  });

  context('Extended Hours', () => {
    it('should render additional inputs if selecting `Yes` for extended hours offering', () => {
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
      it('should render under 36 months extended inputs when selected', () => {
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
        selectExtendedOption();

        cy.get('#schoolage-care-extendedCC-checkbox').click();
        cy.contains('4 hours or less extended child care');
        cy.contains('Over 4 hours extended child care');
      });

      it('should render care on school grounds extended inputs when selected', () => {
        selectExtendedOption();

        cy.get('#care-on-school-grounds-extendedCC-checkbox').click();
        cy.contains('4 hours or less extended child care');
        cy.contains('Over 4 hours extended child care');
      });

      it('should render multi age extended inputs when selected', () => {
        selectExtendedOption();

        cy.get('#multi-age-extendedCC-checkbox').click();
        cy.contains('4 hours or less extended child care');
        cy.contains('Over 4 hours extended child care');
      });
    });
  });
});
