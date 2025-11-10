import FamilyFunding from '@/components/applicationTemplates/v1/family/FamilyFunding.vue';
import vuetify from '@/plugins/vuetify';
import { ORGANIZATION_TYPES } from '@/utils/constants.js';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const fullPathStub = cy.stub();
    cy.mount(FamilyFunding, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $route: {
            fullPath: {
              includes: fullPathStub,
            },
          },
        },
      },
    });
  });
}

describe('<FamilyFunding /> --V1', () => {
  beforeEach(() => {
    mountWithPinia();
  });
  it('should render Licence Type radio group', () => {
    cy.contains('Licence type')
      .closest('.v-radio-group')
      .within(() => {
        cy.get('.v-radio').should('have.length', 3);
        cy.contains('Family child care');
        cy.contains('In-Home Multi-Age Child Care');
        cy.contains('Multi-Age Care');
      });
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
        'not.exist',
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

      cy.contains('label', 'Maximum number of days per week you offer extended hours of child care?').should(
        'be.visible',
      );

      cy.contains('label', 'Maximum number of weeks per year you offer extended hours of child care?').should(
        'be.visible',
      );
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
