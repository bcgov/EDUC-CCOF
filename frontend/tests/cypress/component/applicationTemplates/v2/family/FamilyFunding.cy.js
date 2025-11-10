import FamilyFunding from '@/components/applicationTemplates/v2/family/FamilyFunding.vue';
import vuetify from '@/plugins/vuetify';
import { FAMILY_LICENCE_CATEGORIES, ORGANIZATION_TYPES } from '@/utils/constants.js';

const familyLicenseCategory = [
  { ccof_categorynumber: FAMILY_LICENCE_CATEGORIES.FAMILY_CHILD_CARE },
  { ccof_categorynumber: FAMILY_LICENCE_CATEGORIES.IN_HOME_MULTI_AGE_CHILD_CARE },
  { ccof_categorynumber: FAMILY_LICENCE_CATEGORIES.MULTI_AGE_CHILD_CARE },
];

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

describe('<FamilyFunding /> --V2', () => {
  it('should render input asking if program closed for any month', () => {
    mountWithPinia({
      app: {
        lookupInfo: {
          familyLicenseCategory: '',
        },
      },
    });

    cy.contains('label', 'Are there months when ALL of the programs at this facility are closed for the entire month?')
      .closest('.v-radio-group')
      .within(() => {
        cy.contains('.v-radio', 'Yes');
        cy.contains('.v-radio', 'No');
      });
  });

  it('should not render month checkboxes if selected `No` to if all programs closed', () => {
    mountWithPinia({
      app: {
        lookupInfo: {
          familyLicenseCategory: '',
        },
      },
    });

    cy.contains('label', 'Are there months when ALL of the programs at this facility are closed for the entire month?')
      .closest('.v-radio-group')
      .within(() => {
        cy.contains('.v-radio', 'Yes');
        cy.contains('.v-radio', 'No').click();
      });
    cy.contains('If YES, check all the applicable months:').should('not.exist');
    cy.contains('.v-input', 'Jan').should('not.exist');
  });

  it('should render month checkboxes if selected `Yes` to if all programs closed', () => {
    mountWithPinia({
      app: {
        lookupInfo: {
          familyLicenseCategory: '',
        },
      },
    });

    cy.contains('label', 'Are there months when ALL of the programs at this facility are closed for the entire month?')
      .closest('.v-radio-group')
      .within(() => {
        cy.contains('.v-radio', 'Yes').click();
        cy.contains('.v-radio', 'No');
      });
    cy.contains('If YES, check all the fully closed months:').should('be.exist');
    cy.contains('.v-input', 'January');
    cy.contains('.v-input', 'July');
    cy.contains('.v-input', 'December');
  });

  it('should render month checkboxes if selected `Yes` to if all programs closed', () => {
    mountWithPinia({
      app: {
        lookupInfo: {
          familyLicenseCategory,
        },
      },
    });

    cy.contains('Family Child Care');
    cy.contains('In-Home Multi-Age Child Care');
    cy.contains('Multi-Age Child Care');
  });

  it('should render additional inputs if selecting `Yes` for extended hours offering', () => {
    mountWithPinia({
      app: {
        lookupInfo: {
          familyLicenseCategory,
        },
      },
    });

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
});
