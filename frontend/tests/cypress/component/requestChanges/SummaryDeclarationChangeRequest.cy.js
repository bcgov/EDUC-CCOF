import SummaryDeclarationChangeRequest from '@/components/requestChanges/SummaryDeclarationChangeRequest.vue';
import vuetify from '@/plugins/vuetify';
import { CHANGE_REQUEST_TYPES, CHANGE_TYPES, DOCUMENT_TYPES, PATHS } from '@/utils/constants';

const ORGANIZATION_NAME = 'TEST_ORG_NAME';
const CHANGE_REC_GUID = '43220';

const MTFI_FACILITY = {
  facilityId: '432411',
  facilityName: 'TEST_FAC_NAME',
  facilityAccountNumber: '000112',
  licenseNumber: '111122',
};

const createAuthState = (extras) => {
  return {
    auth: {
      userInfo: {
        organizationName: ORGANIZATION_NAME,
      },
      ...extras,
    },
  };
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
              changeRecGuid: CHANGE_REC_GUID,
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
        ...createAuthState(),
      },
    });
    cy.contains('p', 'Child Care Operating Funding Program');
    cy.contains('h2', 'Summary and Declaration');
  });

  it('should render `Incomplete Form` card', () => {
    mountWithPinia({
      initialState: {
        ...createAuthState(),
      },
    });
    cy.contains('Incomplete Form');
    cy.contains('You will not be able to submit your application until it is complete');
  });

  it('should not render `Incomplete Form` card if summary complete', () => {
    mountWithPinia({
      initialState: {
        ...createAuthState(),
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
        ...createAuthState(),
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
          ...createAuthState(),
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
          ...createAuthState(),
          summaryDeclaration: {
            summaryModel: {
              changeRequestTypes: [CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE],
              mtfiFacilities: [MTFI_FACILITY],
            },
          },
        },
      });
      cy.contains(MTFI_FACILITY.facilityName);
      cy.contains(MTFI_FACILITY.facilityAccountNumber);
      cy.contains(MTFI_FACILITY.licenseNumber);
    });

    it('should render RFI summary component if hasRfi', () => {
      const RFISummaryFac = { ...MTFI_FACILITY, hasRfi: true };
      mountWithPinia({
        initialState: {
          ...createAuthState(),
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
      const AfsSummaryFac = { ...MTFI_FACILITY, enableAfs: true };
      mountWithPinia({
        initialState: {
          ...createAuthState(),
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
          ...createAuthState(),
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
          ...createAuthState(),
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
          ...createAuthState(),
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
          ...createAuthState({ isMinistryUser: true }),
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
        ...createAuthState({ isMinistryUser: true }),
      },
      dataOverride: { dialog: true },
    });
    cy.contains('Your submission has been received. Please refer to your dashboard for updates');
    cy.contains('button', 'Return to your dashboard').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.HOME);
  });
});
