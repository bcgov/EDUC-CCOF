import ApprovableFeeSchedule from '@/components/ccfriApplication/AFS/ApprovableFeeSchedule.vue';
import vuetify from '@/plugins/vuetify';
import { AFS_STATUSES } from '@/utils/constants.js';

const ccfriApplicationId = '1234';
const fundingGuidelinesUrl = 'www.test-123.ca';
const programYearId = '1234';

function mountWithPinia(initialState, routeParams) {
  initialState = initialState || {};
  routeParams = routeParams || { urlGuid: ccfriApplicationId };

  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(ApprovableFeeSchedule, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $route: {
            params: routeParams,
          },
        },
      },
    });
  });
}

function buildInitialState({
  programYearOverrides = {},
  applicationOverrides = {},
  approvableFeeSchedules = [{ ccfriApplicationId }],
  userProfileOverrides = {},
} = {}) {
  return {
    app: {
      programYearList: {
        list: [
          {
            programYearId,
            ...programYearOverrides,
          },
        ],
      },
    },
    application: {
      programYearId,
      ...applicationOverrides,
    },
    ccfriApp: {
      approvableFeeSchedules,
    },
    navBar: {
      userProfileList: [
        {
          ccfriApplicationId,
          ...userProfileOverrides,
        },
      ],
    },
  };
}

describe('<ApprovableFeeSchedule />', () => {
  it('should render default content when no a change request', () => {
    mountWithPinia(
      buildInitialState({
        programYearOverrides: { fundingGuidelinesUrl },
        applicationOverrides: { programYearLabel: 'TEST 2025XX' },
      }),
    );

    cy.contains('div', 'Child Care Operating Funding Program - 2025 Program Confirmation Form');
    cy.contains('div', 'Approvable Fee Schedule');
    cy.contains('div', 'Thank you for working with us while we completed ');
  });

  it('should navigate to getFundingUrl', () => {
    mountWithPinia(
      buildInitialState({
        programYearOverrides: { fundingGuidelinesUrl },
        applicationOverrides: { programYearLabel: 'TEST 2025XX' },
      }),
    );

    cy.contains('a', '2025 CCFRI Funding Guidelines').should('have.attr', 'href').and('include', fundingGuidelinesUrl);
  });

  it('should render approvable parent fees card', () => {
    mountWithPinia(
      buildInitialState({
        approvableFeeSchedules: [
          {
            ccfriApplicationId,
            approvableFeeSchedules: [{}],
          },
        ],
      }),
    );

    cy.contains('Parent Fees : Full-Time');
    cy.get('.v-radio-group')
      .eq(0)
      .within(() => {
        cy.get('.v-radio').should('have.length', 2);
        cy.contains('Daily');
        cy.contains('Monthly');
      });
  });

  it('should render AfsDecisionCard as read only', () => {
    mountWithPinia(
      buildInitialState({
        approvableFeeSchedules: [
          {
            ccfriApplicationId,
            afsStatus: 'OK',
          },
        ],
      }),
    );

    cy.contains('Please select one of the following options regarding the approvable fee schedule:');
    cy.get('.v-radio-group')
      .eq(0)
      .within(() => {
        cy.get('.v-radio').should('have.length', 3);
        cy.get('.v-radio').should('have.css', 'pointer-events', 'none');
        cy.contains('I accept');
        cy.contains('I want to upload supporting documents');
        cy.contains('I decline');
      });
  });

  it('should render AfsDecisionCard as editable', () => {
    mountWithPinia(
      buildInitialState({
        applicationOverrides: { applicationStatus: 'INCOMPLETE' },
        approvableFeeSchedules: [
          {
            ccfriApplicationId,
            afsStatus: 'OK',
          },
        ],
      }),
    );

    cy.contains('Please select one of the following options regarding the approvable fee schedule:');
    cy.get('.v-radio-group').should('not.have.css', 'pointer-events', 'none');
  });

  it('should render document upload', () => {
    mountWithPinia(
      buildInitialState({
        applicationOverrides: { applicationStatus: 'INCOMPLETE' },
        approvableFeeSchedules: [
          {
            ccfriApplicationId,
            afsStatus: AFS_STATUSES.UPLOAD_DOCUMENTS,
          },
        ],
      }),
    );

    cy.contains('Upload Supporting Documents');
    cy.contains('button', 'Add File');
  });

  it('should render navigation buttons', () => {
    mountWithPinia(buildInitialState());

    cy.contains('button', 'Back');
    cy.contains('button', 'Next');
    cy.contains('button', 'Save');
  });
});
