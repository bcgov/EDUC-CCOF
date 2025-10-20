import ApprovableFeeSchedule from '@/components/ccfriApplication/AFS/ApprovableFeeSchedule.vue';
import vuetify from '@/plugins/vuetify';
import { AFS_STATUSES } from '@/utils/constants.js';

const ccfriApplicationId = '1234';

function mountWithPinia(initialState = {}, routeParams = { urlGuid: ccfriApplicationId }) {
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

describe('<ApprovableFeeSchedule />', () => {
  it('should render default content when no a change request', () => {
    mountWithPinia({
      app: {
        programYearList: {
          list: [
            {
              programYearId: '1234',
              fundingGuidelinesUrl: 'wwwww',
            },
          ],
        },
      },
      application: {
        programYearId: '1234',
        programYearLabel: 'TEST 2025XX',
      },
      ccfriApp: {
        approvableFeeSchedules: [
          {
            ccfriApplicationId,
          },
        ],
      },
      navBar: {
        userProfileList: [
          {
            ccfriApplicationId,
            licenseNumber: '3',
            facilityId: '444',
          },
        ],
      },
    });
    cy.contains('div', 'Child Care Operating Funding Program - 2025 Program Confirmation Form');
    cy.contains('div', 'Approvable Fee Schedule');
    cy.contains('div', 'Thank you for working with us while we completed ');
  });

  it('should navigate to getFundingUrl', () => {
    const fundingGuidelinesUrl = 'www.test-123.ca';
    mountWithPinia({
      app: {
        programYearList: {
          list: [
            {
              programYearId: '1234',
              fundingGuidelinesUrl,
            },
          ],
        },
      },
      application: {
        programYearId: '1234',
        programYearLabel: 'TEST 2025XX',
      },
      ccfriApp: {
        approvableFeeSchedules: [
          {
            ccfriApplicationId,
          },
        ],
      },
      navBar: {
        userProfileList: [
          {
            ccfriApplicationId,
          },
        ],
      },
    });
    cy.contains('a', '2025 CCFRI Funding Guidelines').should('have.attr', 'href').and('include', fundingGuidelinesUrl);
  });

  it('should render approvable parent fees card', () => {
    const fundingGuidelinesUrl = 'www.test-123.ca';
    mountWithPinia({
      app: {
        programYearList: {
          list: [
            {
              programYearId: '1234',
              fundingGuidelinesUrl,
            },
          ],
        },
      },
      application: {
        programYearId: '1234',
        programYearLabel: 'TEST 2025XX',
      },
      ccfriApp: {
        approvableFeeSchedules: [
          {
            ccfriApplicationId,
            approvableFeeSchedules: [{}],
          },
        ],
      },
      navBar: {
        userProfileList: [
          {
            ccfriApplicationId,
          },
        ],
      },
    });
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
    const fundingGuidelinesUrl = 'www.test-123.ca';
    mountWithPinia({
      app: {
        programYearList: {
          list: [
            {
              programYearId: '1234',
              fundingGuidelinesUrl,
            },
          ],
        },
      },
      application: {
        programYearId: '1234',
        programYearLabel: 'TEST 2025XX',
      },
      ccfriApp: {
        approvableFeeSchedules: [
          {
            ccfriApplicationId,
            afsStatus: 'OK',
          },
        ],
      },
      navBar: {
        userProfileList: [
          {
            ccfriApplicationId,
          },
        ],
      },
    });
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
    const fundingGuidelinesUrl = 'www.test-123.ca';
    mountWithPinia({
      app: {
        programYearList: {
          list: [
            {
              programYearId: '1234',
              fundingGuidelinesUrl,
            },
          ],
        },
      },
      application: {
        programYearId: '1234',
        programYearLabel: 'TEST 2025XX',
        applicationStatus: 'INCOMPLETE',
      },
      ccfriApp: {
        approvableFeeSchedules: [
          {
            ccfriApplicationId,
            afsStatus: 'OK',
          },
        ],
      },
      navBar: {
        userProfileList: [
          {
            ccfriApplicationId,
          },
        ],
      },
    });
    cy.contains('Please select one of the following options regarding the approvable fee schedule:');
    cy.get('.v-radio-group').should('not.have.css', 'pointer-events', 'none');
  });

  it('should render document upload', () => {
    const fundingGuidelinesUrl = 'www.test-123.ca';
    mountWithPinia({
      app: {
        programYearList: {
          list: [
            {
              programYearId: '1234',
              fundingGuidelinesUrl,
            },
          ],
        },
      },
      application: {
        programYearId: '1234',
        programYearLabel: 'TEST 2025XX',
        applicationStatus: 'INCOMPLETE',
      },
      ccfriApp: {
        approvableFeeSchedules: [
          {
            ccfriApplicationId,
            afsStatus: AFS_STATUSES.UPLOAD_DOCUMENTS,
          },
        ],
      },
      navBar: {
        userProfileList: [
          {
            ccfriApplicationId,
          },
        ],
      },
    });
    cy.contains('Upload Supporting Documents');
    cy.contains('button', 'Add File');
  });

  it.only('should render navigation buttons', () => {
    const fundingGuidelinesUrl = 'www.test-123.ca';
    mountWithPinia({
      app: {
        programYearList: {
          list: [
            {
              programYearId: '1234',
              fundingGuidelinesUrl,
            },
          ],
        },
      },
      application: {
        programYearId: '1234',
      },
      ccfriApp: {
        approvableFeeSchedules: [
          {
            ccfriApplicationId,
          },
        ],
      },
      navBar: {
        userProfileList: [
          {
            ccfriApplicationId,
          },
        ],
      },
    });
    cy.contains('button', 'Back');
    cy.contains('button', 'Next');
    cy.contains('button', 'Save');
  });
});
