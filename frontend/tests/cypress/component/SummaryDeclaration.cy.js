// TODO: Do expansion panel tests if needed
// REfactor tests

import SummaryDeclaration from '@/components/SummaryDeclaration.vue';
import vuetify from '@/plugins/vuetify';
import { PATHS } from '@/utils/constants.js';

const organizationName = 'TEST-ORG-NAME';
const programYearId = '1234';
const previousYearId = '4321';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    cy.mount(SummaryDeclaration, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
        },
      },
    });
    cy.wrap(pushStub).as('routerPush');
  });
}

describe('<SummaryDeclaration />', () => {
  it('should render default component text', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          organizationName,
        },
      },
      app: {
        programYearList: {
          list: [
            {
              programYearId,
            },
          ],
        },
      },
      application: {
        programYearId,
        programYearLabel: '2025-26 FY', // optional; for this test only
      },
    });
    cy.contains('Child Care Operating Funding Program - 2025-26');
    cy.contains('h2', 'Summary and Declaration');
    cy.contains('p', organizationName);
  });

  context('Change Request Notice Card', () => {
    it('should render the change request notice card when a change request is active', () => {
      const curProgramYearName = 'ProgramYearListName';
      mountWithPinia({
        auth: {
          userInfo: {
            organizationName,
          },
        },
        app: {
          programYearList: {
            list: [
              {
                programYearId,
                previousYearId,
                name: curProgramYearName,
              },
              {
                programYearId: previousYearId,
              },
            ],
          },
        },
        application: {
          programYearId,
        },
        reportChanges: {
          changeRequestStore: [
            {
              externalStatus: 2,
              changeActions: [
                {
                  changeType: '', // is not != PARENT_FEE_CHANGE
                },
              ],
            },
          ],
        },
        navBar: {
          currentUrl: '', // does not start with PATHS.PREFIX.CHANGE_REQUEST
        },
      });
      cy.contains(`You have a change request for the ${curProgramYearName} funding term still in progress.`);
      cy.contains('The Program Confirmation Form cannot be submitted until the change is complete.');
    });

    it('should not render the change request notice card', () => {
      mountWithPinia({
        auth: {
          userInfo: {
            organizationName,
          },
        },
        app: {
          programYearList: {
            list: [
              {
                programYearId,
                previousYearId,
              },
            ],
          },
        },
        application: {
          programYearId,
        },
        reportChanges: {
          changeRequestStore: [
            {
              externalStatus: 0,
            },
          ],
        },
      });
      cy.contains('The Program Confirmation Form cannot be submitted until the change is complete.').should(
        'not.exist',
      );
    });

    it('should render `View my Changes` button and redirect to change request history on click', () => {
      const curProgramYearName = 'ProgramYearListName';
      mountWithPinia({
        auth: {
          userInfo: {
            organizationName,
          },
        },
        app: {
          programYearList: {
            list: [
              {
                programYearId,
                previousYearId,
                name: curProgramYearName,
              },
              {
                programYearId: previousYearId,
              },
            ],
          },
        },
        application: {
          programYearId,
        },
        reportChanges: {
          changeRequestStore: [
            {
              externalStatus: 2,
              changeActions: [
                {
                  changeType: '', // is not != PARENT_FEE_CHANGE
                },
              ],
            },
          ],
        },
        navBar: {
          currentUrl: '', // does not start with PATHS.PREFIX.CHANGE_REQUEST
        },
      });
      cy.contains('button', 'View My Changes').click();
      cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.CHANGE_LANDING + '#change-request-history');
    });
  });

  it('should render `Unlocked PCF application in progress` card', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          organizationName,
        },
      },
      app: {
        programYearList: {
          list: [
            {
              programYearId,
            },
          ],
        },
      },
      application: {
        programYearId,
        programYearLabel: '2025-26 FY',
        applicationMap: new Map([['1', { unlockBaseFunding: true, applicationType: 'NEW' }]]),
      },
      navBar: {
        currentUrl: PATHS.PREFIX.CHANGE_REQUEST,
      },
    });
    cy.contains('You have an unlocked PCF application still in progress.');
    cy.contains('You will be unable to submit a change request until the Program Confirmation Form is updated.');
  });

  it('should not render `Unlocked PCF application in progress` card', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          organizationName,
        },
      },
      app: {
        programYearList: {
          list: [
            {
              programYearId,
            },
          ],
        },
      },
      application: {
        programYearId,
        programYearLabel: '2025-26 FY',
      },
    });
    cy.contains('You have an unlocked PCF application still in progress.').should('not.exist');
    cy.contains('You will be unable to submit a change request until the Program Confirmation Form is updated.').should(
      'not.exist',
    );
  });

  it('should render `Incomplete Form` when applications are incomplete', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          organizationName,
        },
      },
      app: {
        programYearList: {
          list: [
            {
              programYearId,
            },
          ],
        },
      },
      application: {
        programYearId,
        programYearLabel: '2025-26 FY',
      },
    });
    cy.contains('Incomplete Form');
    cy.contains('You will not be able to submit your application until it is complete.');
    cy.contains('Incomplete sections are marked with a red exclamation point.');
  });

  it('should not render `Incomplete Form` when applications are complete', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          organizationName,
        },
      },
      app: {
        programYearList: {
          list: [
            {
              programYearId,
            },
          ],
        },
      },
      application: {
        programYearId,
        programYearLabel: '2025-26 FY',
        isRenewal: true,
      },
      summaryDeclaration: {
        summaryModel: {
          ecewe: { dummyKey: 'dummyVal', optInECEWE: true },
          application: { organizationProviderType: 'NOT_GROUP' },
        },
      },
    });
    cy.contains('Incomplete Form').should('not.exist');
  });

  context('Declaration Section', () => {
    it('should render declaration A text', () => {
      mountWithPinia({
        auth: {
          userInfo: {
            organizationName,
          },
        },
        app: {
          programYearList: {
            list: [
              {
                programYearId,
              },
            ],
          },
        },
        application: {
          programYearId,
        },
      });
      cy.contains(
        'I hereby confirm that the information I have provided in this application is complete and accurate. I certify that I have read and understand the following requirements:',
      );
    });

    it('should render checkbox for not a renewal', () => {
      mountWithPinia({
        auth: {
          userInfo: {
            organizationName,
          },
        },
        app: {
          programYearList: {
            list: [
              {
                programYearId,
              },
            ],
          },
        },
        application: {
          programYearId,
          isRenewal: false,
        },
      });
      cy.contains(
        'I hereby confirm that the information I have provided in this application is complete and accurate. I certify that I have read and understand the following requirements:',
      );
    });

    it('should render checkbox for renewal type', () => {
      mountWithPinia({
        auth: {
          userInfo: {
            organizationName,
          },
        },
        app: {
          programYearList: {
            list: [
              {
                programYearId,
              },
            ],
          },
        },
        application: {
          programYearId,
          isRenewal: true,
        },
      });
      cy.contains(
        '.v-checkbox',
        'I hereby confirm that the information I have provided in this application is complete and accurate. I certify that I have read and understand the following requirements:',
      ).should('not.exist');

      cy.contains('.v-checkbox', 'I agree, consent, and certify');
    });

    it.only('should render last submitted timestamp', () => {
      const latestSubmissionDate = '2025-12-31 12:59';
      mountWithPinia({
        auth: {
          userInfo: {
            organizationName,
          },
          isMinistryUser: true,
        },
        app: {
          programYearList: {
            list: [
              {
                programYearId,
              },
            ],
          },
        },
        application: {
          programYearId,
        },
        summaryDeclaration: {
          declarationModel: {
            latestSubmissionDate,
          },
        },
      });
      cy.contains(`Last Submitted on: ${latestSubmissionDate}`);
    });
  });
});
