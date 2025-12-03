import SummaryDeclarationChangeRequest from '@/components/requestChanges/SummaryDeclarationChangeRequest.vue';
import vuetify from '@/plugins/vuetify';
import { CHANGE_REQUEST_TYPES, CHANGE_TYPES, DOCUMENT_TYPES, PATHS } from '@/utils/constants';

const organizationName = 'TEST_ORG_NAME';
const changeRecGuid = '43220';

const mtfiFacility = {
  facilityId: '432411',
  facilityName: 'TEST_FAC_NAME',
  facilityAccountNumber: '000112',
  licenseNumber: '111122',
};

function mountWithPinia({ initialState = {}, dataOverride = {} } = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub().as('routerPush');
    cy.mount(SummaryDeclarationChangeRequest, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
          $route: {
            params: {
              changeRecGuid,
            },
          },
        },
      },
      data() {
        return {
          ...dataOverride,
        };
      },
    });
  });
}

describe('<SummaryDeclarationChangeRequest />', () => {
  beforeEach(() => {
    cy.viewport(1080, 1080);
  });
  it('should render component headings', () => {
    mountWithPinia({
      initialState: {
        auth: {
          userInfo: {
            organizationName,
          },
        },
      },
    });
    cy.contains('p', 'Child Care Operating Funding Program');
    cy.contains('h2', 'Summary and Declaration');
  });

  it('should render `Incomplete Form` card', () => {
    mountWithPinia({
      initialState: {
        auth: {
          userInfo: {
            organizationName,
          },
        },
      },
    });
    cy.contains('Incomplete Form');
    cy.contains('You will not be able to submit your application until it is complete');
  });

  it('should not render `Incomplete Form` card if summary complete', () => {
    mountWithPinia({
      initialState: {
        auth: {
          userInfo: {
            organizationName,
          },
        },
        navBar: {
          changeType: CHANGE_TYPES.CHANGE_NOTIFICATION,
        },
        reportChanges: {
          uploadedDocuments: [{ subject: DOCUMENT_TYPES.CR_NOTIFICATION_FORM }],
        },
      },
    });
    cy.contains('Incomplete Form').should('not.exist');
  });

  it('should render `PCF unlocked` card', () => {
    mountWithPinia({
      initialState: {
        auth: {
          userInfo: {
            organizationName,
          },
        },
        application: {
          applicationMap: new Map([['key', { unlockEcewe: true }]]),
        },
      },
    });
    cy.contains('You have an unlocked PCF application still in progress.');
    cy.contains('You will be unable to submit a change request until the Program Confirmation Form is updated.');
  });

  context('Summary Card', () => {
    it('should render change notification form summary component', () => {
      mountWithPinia({
        initialState: {
          auth: {
            userInfo: {
              organizationName,
            },
          },
          summaryDeclaration: {
            summaryModel: { changeRequestTypes: [CHANGE_REQUEST_TYPES.PDF_CHANGE] },
          },
        },
      });
      cy.contains('Change Notification Form');
    });

    it('should render MTFI summary component', () => {
      mountWithPinia({
        initialState: {
          auth: {
            userInfo: {
              organizationName,
            },
          },
          summaryDeclaration: {
            summaryModel: {
              changeRequestTypes: [CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE],
              mtfiFacilities: [mtfiFacility],
            },
          },
        },
      });
      cy.contains(mtfiFacility.facilityName);
      cy.contains(mtfiFacility.facilityAccountNumber);
      cy.contains(mtfiFacility.licenseNumber);
    });

    it('should render RFI summary component if hasRfi', () => {
      const RFISummaryFac = { ...mtfiFacility, hasRfi: true };
      mountWithPinia({
        initialState: {
          auth: {
            userInfo: {
              organizationName,
            },
          },
          summaryDeclaration: {
            summaryModel: {
              changeRequestTypes: [CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE],
              mtfiFacilities: [RFISummaryFac],
            },
          },
        },
      });
      cy.contains('Request for Information (RFI)');
    });

    it('should render AFS summary component if enableAfs', () => {
      const AfsSummaryFac = { ...mtfiFacility, enableAfs: true };
      mountWithPinia({
        initialState: {
          auth: {
            userInfo: {
              organizationName,
            },
          },
          summaryDeclaration: {
            summaryModel: {
              changeRequestTypes: [CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE],
              mtfiFacilities: [AfsSummaryFac],
            },
          },
        },
      });
      cy.contains('Approvable Fee Schedule');
    });
  });

  context('Decleration Summary', () => {
    it('should render long checkbox text when not a renewal', () => {
      mountWithPinia({
        initialState: {
          auth: {
            userInfo: {
              organizationName,
            },
          },
          application: {
            isRenewal: false,
          },
        },
      });
      cy.contains(
        '.v-checkbox',
        'I, the applicant, do hereby certify that all the information provided is true and complete to the best of my knowledge and belief. By clicking this check-box, I indicate that I agree to the foregoing terms and conditions.',
      );
    });

    it('should render shortened checkbox text when a renewal', () => {
      mountWithPinia({
        initialState: {
          auth: {
            userInfo: {
              organizationName,
            },
          },
          application: {
            isRenewal: true,
          },
        },
      });
      cy.contains('.v-checkbox', 'I agree, consent, and certify');
    });

    it('should render signature field', () => {
      mountWithPinia({
        initialState: {
          auth: {
            userInfo: {
              organizationName,
            },
          },
          application: {
            isRenewal: true,
          },
        },
      });
      cy.contains('.v-text-field', `Your Organization's Authorized Signing Authority`);
    });

    it('should render last submitted timestamp', () => {
      const latestSubmissionDate = '2025-11-27 01:01';
      mountWithPinia({
        initialState: {
          auth: {
            isMinistryUser: true,
            userInfo: {
              organizationName,
            },
          },
          application: {
            isRenewal: true,
          },
          summaryDeclaration: {
            declarationModel: {
              latestSubmissionDate,
            },
          },
        },
      });
      cy.contains(`Last submitted on: ${latestSubmissionDate}`);
    });
  });

  it('should render app dialog for submission receival', () => {
    mountWithPinia({
      initialState: {
        auth: {
          isMinistryUser: true,
          userInfo: {
            organizationName,
          },
        },
      },
      dataOverride: { dialog: true },
    });
    cy.contains('Your submission has been received. Please refer to your dashboard for updates');
    cy.contains('button', 'Return to your dashboard').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.HOME);
  });
});
