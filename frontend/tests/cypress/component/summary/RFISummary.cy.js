import { h } from 'vue';
import { VExpansionPanel, VExpansionPanels } from 'vuetify/components';

import RFISummary from '@/components/summary/group/RFISummary.vue';
import vuetify from '@/plugins/vuetify';

const INCLUSION_TITLE = 'Priority Service Expansion: Inclusion';

function rfiApp(overrides = {}) {
  return {
    exceptionalCircumstances: 0,
    feeIncreaseDueToWage: 0,
    feeIncreaseExtendedHours: 0,
    IndigenousConnection: 0,
    underservedPop: 0,
    expenseList: [],
    fundingList: [],
    wageList: [],
    expansionList: [],
    indigenousExpenseList: [],
    inclusionExpenseList: [],
    ...overrides,
  };
}

function completeInclusion(overrides = {}) {
  return {
    inclusionEligibleExpenseAndPolicy: 1,
    inclusionBusinessCase: 'Business case text',
    inclusionParentFeeScope: 101510000,
    inclusionStaffExpenses: 1,
    inclusionStaffingExplanation: 'Staffing model text',
    inclusionExpenseList: [
      { id: 'x1', description: 'Adaptive equipment', date: '2027-05-10', frequency: 'One-time', expense: 1500 },
    ],
    ...overrides,
  };
}

function mountSummary({ templateVersion = 4, rfi = rfiApp() } = {}) {
  const initialState = {
    application: { applicationTemplateVersion: templateVersion, isApplicationProcessing: false },
    navBar: {},
  };
  const Wrapper = {
    render: () =>
      h(VExpansionPanels, { modelValue: [0], multiple: true }, () => [
        h(VExpansionPanel, { value: 0 }, () => [
          h(RFISummary, { rfiApp: rfi, ccfriId: 'ccfri-1', programYearId: 'py-1' }),
        ]),
      ]),
  };

  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(Wrapper, {
      global: {
        plugins: [pinia, vuetify],
        mocks: { $route: { params: {} } },
        stubs: {
          'router-link': {
            render() {
              return h('a', this.$slots.default?.());
            },
          },
        },
      },
    });
  });
}

function inclusionBlock() {
  return cy.contains('h4', INCLUSION_TITLE).parent();
}

describe('<RFISummary /> - template V3 vs V4', () => {
  beforeEach(() => {
    cy.viewport(1280, 1000);
  });

  context('Other Sources of Funding wording', () => {
    const otherFunding = {
      exceptionalCircumstances: 1,
      circumstanceOccurWithin6Month: 1,
      q3: 1,
      fundingList: [{ fundingProgram: 'Insurer A', date: '2027-04-01', status: 'Pending', amount: 1, expenses: 1 }],
    };

    it('V3: shows the original header, question and table headers', () => {
      mountSummary({ templateVersion: 3, rfi: rfiApp(otherFunding) });

      cy.contains('h5', 'Other Sources of Ministry Funding');
      cy.contains('for any of the expenses you listed?');
      cy.contains('or submitted an insurance claim').should('not.exist');
      cy.contains('th', /^Funding Program$/);
      cy.contains('th', /^Application Date$/);
      cy.contains('th', /^Status of Application$/);
    });

    it('V4: shows the insurance header, question and table headers', () => {
      mountSummary({ templateVersion: 4, rfi: rfiApp({ ...otherFunding, inclusionEligibleExpenseAndPolicy: 0 }) });

      cy.contains('h5', /^\s*Other Sources of Funding\s*$/);
      cy.contains('h5', 'Other Sources of Ministry Funding').should('not.exist');
      cy.contains('or submitted an insurance claim for any of the expenses you listed?');
      cy.contains('th', 'Funding Program or Insurer');
      cy.contains('th', 'Application/Claim Date');
      cy.contains('th', 'Status of Application/Claim');
      cy.get('input[value="Insurer A"]').should('exist');
    });
  });

  context('PSE Inclusion block', () => {
    [1, 2, 3].forEach((templateVersion) => {
      it(`V${templateVersion}: does not show the Inclusion block and the RFI is not flagged by it`, () => {
        mountSummary({ templateVersion, rfi: rfiApp() });

        cy.contains(INCLUSION_TITLE).should('not.exist');
        cy.contains('To add this information, click here').should('not.exist');
      });
    });

    it('V4: Q1 not answered shows Required and the "click here" link', () => {
      mountSummary({ templateVersion: 4, rfi: rfiApp() });

      inclusionBlock().within(() => {
        cy.contains('Does your facility have: an expense that meets an immediate inclusion need');
        cy.get('input[placeholder="Required"]').should('have.length', 1).and('have.value', '');
      });
      cy.contains('To add this information, click here');
    });

    it('V4: Q1 = No shows "No", no follow-up questions, and the RFI is complete', () => {
      mountSummary({ templateVersion: 4, rfi: rfiApp({ inclusionEligibleExpenseAndPolicy: 0 }) });

      inclusionBlock().within(() => {
        cy.get('input').first().should('have.value', 'No');
        cy.contains('Describe the expense').should('not.exist');
        cy.contains('Expense Information').should('not.exist');
      });
      cy.contains('To add this information, click here').should('not.exist');
    });

    it('V4: fully answered section shows every answer and the RFI is complete', () => {
      mountSummary({ templateVersion: 4, rfi: rfiApp(completeInclusion()) });

      inclusionBlock().within(() => {
        cy.get('input').eq(0).should('have.value', 'Yes');
        cy.contains('p', 'Business case text');
        cy.get('input[value="All children"]').should('exist');
        cy.contains('p', 'Staffing model text');
        cy.contains('Expense Information');
        cy.get('input[value="Adaptive equipment"]').should('exist');
        cy.get('input[value="2027-05-10"]').should('exist');
        cy.get('input[value="One-time"]').should('exist');
        cy.get('input[value="1500"]').should('exist');
      });
      cy.contains('To add this information, click here').should('not.exist');
    });

    it('V4: Q2 = Only children with support needs shows its label', () => {
      mountSummary({ templateVersion: 4, rfi: rfiApp(completeInclusion({ inclusionParentFeeScope: 101510001 })) });

      inclusionBlock().find('input[value="Only children with support needs"]').should('exist');
    });

    it('V4: Q3 = No hides the staffing explanation and is still complete', () => {
      mountSummary({
        templateVersion: 4,
        rfi: rfiApp(completeInclusion({ inclusionStaffExpenses: 0, inclusionStaffingExplanation: null })),
      });

      inclusionBlock().within(() => {
        cy.contains("If yes, explain your facility's wages and staffing model").should('not.exist');
        cy.get('input[value="No"]').should('exist');
      });
      cy.contains('To add this information, click here').should('not.exist');
    });

    it('V4: Q1 = Yes with nothing else answered shows Required for every missing item', () => {
      mountSummary({ templateVersion: 4, rfi: rfiApp({ inclusionEligibleExpenseAndPolicy: 1 }) });

      inclusionBlock().within(() => {
        cy.contains('Describe the expense and how it meets');
        cy.contains('Will your proposed Parent Fees be charged');
        cy.contains('Do you have expenses related to wages');
        // business case, Q2, Q3, and the empty expense table
        cy.get('input[placeholder="Required"]')
          .filter((_, el) => !el.value)
          .should('have.length', 4);
        cy.contains("If yes, explain your facility's wages and staffing model").should('not.exist');
      });
      cy.contains('To add this information, click here');
    });

    it('V4: Q3 = Yes without an explanation shows Required for the explanation', () => {
      mountSummary({
        templateVersion: 4,
        rfi: rfiApp(completeInclusion({ inclusionStaffingExplanation: '' })),
      });

      inclusionBlock().within(() => {
        cy.contains("If yes, explain your facility's wages and staffing model");
        cy.get('input[placeholder="Required"]')
          .filter((_, el) => !el.value)
          .should('have.length', 1);
      });
      cy.contains('To add this information, click here');
    });

    it('V4: an expense row with missing values shows Required in those cells', () => {
      mountSummary({
        templateVersion: 4,
        rfi: rfiApp(
          completeInclusion({
            inclusionExpenseList: [{ id: 'x1', description: '', date: null, frequency: 'Monthly', expense: 0 }],
          }),
        ),
      });

      inclusionBlock().within(() => {
        cy.get('input[value="Monthly"]').should('exist');
        cy.get('input[value="0"]').should('exist');
        cy.get('input[placeholder="Required"]')
          .filter((_, el) => !el.value)
          .should('have.length', 2);
      });
      cy.contains('To add this information, click here');
    });

    it('V4: unknown Q2 value is treated as missing', () => {
      mountSummary({ templateVersion: 4, rfi: rfiApp(completeInclusion({ inclusionParentFeeScope: 999 })) });

      inclusionBlock()
        .find('input[placeholder="Required"]')
        .filter((_, el) => !el.value)
        .should('have.length', 1);
      cy.contains('To add this information, click here');
    });
  });
});
