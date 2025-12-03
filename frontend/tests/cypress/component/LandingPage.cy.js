import LandingPage from '@/components/LandingPage.vue';
import vuetify from '@/plugins/vuetify';
import {
  APPLICATION_STATUSES,
  APPLICATION_TYPES,
  CHANGE_REQUEST_EXTERNAL_STATUS,
  ORGANIZATION_GOOD_STANDING_STATUSES,
  ORGANIZATION_PROVIDER_TYPES,
  PATHS,
  pcfUrl,
  pcfUrlGuid,
} from '@/utils/constants.js';
import { PERMISSIONS } from '@/utils/constants/permissions';

const organizationAccountNumber = 'ORG-1234';
const organizationName = 'Test Organization';
const facilityAccountNumber = 'FAC-45678';
const ccfriApplicationId = '111';
const facilityName = 'CCOF Medical Center';
const licenseNumber = 'L1234567890';
const programYearId = '5555';
const navBar = {
  navBarList: [{ unlockCcfri: true, ccfriApplicationId }],
};

const permWithoutStartApp = Object.values(PERMISSIONS).filter(
  (permission) => permission !== PERMISSIONS.CREATE_NEW_APPLICATION,
);

const createAuthStore = (userInfo = {}, authExtras = {}) => ({
  auth: {
    userInfo: {
      serverTime: new Date(),
      ...userInfo,
    },
    ...authExtras,
  },
});

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    cy.mount(LandingPage, {
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

function checkButtonAndNavigate(buttonText, expectedPath) {
  cy.contains('button', buttonText).click();
  cy.get('@routerPush').should('have.been.calledWith', expectedPath);
}

describe('<LandingPage />', () => {
  it('should display organization id and name', () => {
    mountWithPinia({
      organization: {
        organizationAccountNumber,
        organizationName,
      },
    });

    cy.contains(`Organization ID: ${organizationAccountNumber}`).should('exist');
    cy.contains('Organization Name: Test Organization').should('exist');
  });

  it('should not render the div if both values are missing', () => {
    mountWithPinia({
      organization: {
        organizationAccountNumber: '',
        organizationName: '',
      },
    });

    cy.contains('Organization ID:').should('not.exist');
    cy.contains('Organization Name:').should('not.exist');
  });

  it('should not display app alert if good standing', () => {
    mountWithPinia({
      ...createAuthStore({
        organizationGoodStandingStatus: '',
        organizationBypassGoodStandingCheck: true,
      }),
    });

    cy.contains('Your organization is not in good standing with BC Registries and Online Services.').should(
      'not.exist',
    );
  });

  it('should display app alert if not good standing', () => {
    mountWithPinia({
      ...createAuthStore({
        organizationGoodStandingStatus: ORGANIZATION_GOOD_STANDING_STATUSES.FAIL,
        organizationBypassGoodStandingCheck: false,
      }),
    });

    cy.contains('Your organization is not in good standing with BC Registries and Online Services.').should('exist');
  });

  context('Application Status Card ', () => {
    const authWithDownloadPerm = createAuthStore({}, { permissions: [PERMISSIONS.DOWNLOAD_PCF_PDF] });

    const expectFundingTitles = () => {
      cy.contains('CCOF Base Funding');
      cy.contains('Child Care Fee Reduction Initiative (CCFRI) Funding');
      cy.contains('Early Childhood Educator Wage Enhancement (ECE-WE) Funding');
    };

    const expectFundingBody = (shouldExist) => {
      const assertion = shouldExist ? 'exist' : 'not.exist';

      cy.contains('Base Funding assists eligible licensed family and group child care providers').should(assertion);

      cy.contains('The CCFRI offers funding to eligible, licensed child care providers to reduce and stabilize').should(
        assertion,
      );

      cy.contains(
        'Providers with licensed care facilities can apply for a wage enhancement for Early Childhood',
      ).should(assertion);
    };
    it('should not render application status col if no download pcf pdf permission', () => {
      const permWithoutDownloadPDF = Object.values(PERMISSIONS).filter(
        (permission) => permission !== PERMISSIONS.DOWNLOAD_PCF_PDF,
      );
      mountWithPinia({
        auth: {
          isAuthenticated: true,
          permissions: permWithoutDownloadPDF,
        },
      });
      cy.contains('Apply for Child Care Operating Funding').should('not.exist');
    });

    it('should display CCOF text when approved and no actions required', () => {
      mountWithPinia({
        application: {
          applicationType: 'RENEW',
          applicationMap: new Map(),
        },
        ...authWithDownloadPerm,
      });

      cy.contains('Child Care Operating Funding (CCOF)').should('exist');
      cy.contains('Apply for Child Care Operating Funding (CCOF)').should('not.exist');
    });

    it('should display `apply CCOF` when not approved', () => {
      mountWithPinia({
        application: {
          applicationType: '',
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.DOWNLOAD_PCF_PDF] }),
      });
      expectFundingTitles();
    });

    it('should display only `new application text` titles when not approved and not new', () => {
      mountWithPinia({
        application: {
          applicationType: 'NEW',
          applicationStatus: 'SUBMITTED',
        },
        ...authWithDownloadPerm,
      });
      expectFundingTitles();
      expectFundingBody(false);
    });

    it('should display `new application` text and body', () => {
      mountWithPinia({
        application: {
          applicationType: '',
        },
        ...authWithDownloadPerm,
      });
      expectFundingTitles();
      expectFundingBody(true);
    });

    it('should not display `new application` data', () => {
      mountWithPinia({
        application: {
          applicationType: 'RENEW',
        },
        ...authWithDownloadPerm,
      });
      cy.contains('Child Care Operating Funding');
      cy.contains('Early Childhood Educator Wage Enhancement (ECE-WE) Funding').should('not.exist');
    });

    it('should not display `Start Application` button if no create app permissions', () => {
      mountWithPinia({
        app: {
          programYearList: {
            newApp: {
              programYearId,
            },
          },
        },
        ...createAuthStore({}, { permissions: permWithoutStartApp }),
      });
      cy.contains('button', 'Start Application').should('not.exist');
    });

    it('should display `Start Application` button and navigate to intermediate page', () => {
      mountWithPinia({
        app: {
          programYearList: {
            newApp: {
              programYearId,
            },
          },
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.DOWNLOAD_PCF_PDF, PERMISSIONS.CREATE_NEW_APPLICATION] }),
      });

      checkButtonAndNavigate('Start Application', pcfUrl(PATHS.NEW_APPLICATION_INTERMEDIATE, programYearId));
    });

    it('should not display `Continue Application` without create app permissions', () => {
      mountWithPinia({
        application: {
          applicationType: 'NEW',
          applicationStatus: 'DRAFT',
          programYearId,
        },
        organization: {
          organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
        },
        ...createAuthStore({}, { permissions: permWithoutStartApp }),
      });
      cy.contains('Status: Incomplete').should('not.exist');
      cy.contains('button', 'Continue Application').should('not.exist');
    });

    it('should display `Continue Application` and navigate to group organization', () => {
      mountWithPinia({
        application: {
          applicationType: 'NEW',
          applicationStatus: 'DRAFT',
          programYearId,
        },
        organization: {
          organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.DOWNLOAD_PCF_PDF, PERMISSIONS.CREATE_NEW_APPLICATION] }),
      });
      cy.contains('Status: Incomplete');
      checkButtonAndNavigate('Continue Application', pcfUrl(PATHS.CCOF_GROUP_ORG, programYearId));
    });

    it('should display `Continue Application` and navigate to family organization', () => {
      mountWithPinia({
        application: {
          applicationType: 'NEW',
          applicationStatus: 'DRAFT',
          programYearId,
        },
        organization: {
          organizationProviderType: ORGANIZATION_PROVIDER_TYPES.FAMILY,
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.DOWNLOAD_PCF_PDF, PERMISSIONS.CREATE_NEW_APPLICATION] }),
      });
      checkButtonAndNavigate('Continue Application', pcfUrl(PATHS.CCOF_FAMILY_ORG, programYearId));
    });

    it('should display `Cancel Application`', () => {
      mountWithPinia({
        application: {
          applicationType: 'NEW',
          applicationStatus: 'DRAFT',
          ccofApplicationStatus: 'NEW',
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.DOWNLOAD_PCF_PDF, PERMISSIONS.CREATE_NEW_APPLICATION] }),
      });
      cy.contains('button', 'Cancel Application');
    });

    it('should display `active` status for active funding agreement', () => {
      mountWithPinia({
        application: {
          applicationType: 'N/A',
          latestProgramYearId: '1111',
          ccofApplicationStatus: 'ACTIVE',
        },
        ...authWithDownloadPerm,
      });
      cy.contains('Status of your funding agreement for the current fiscal year: Active');
    });

    it('should display `submit` status for submitted funding agreement', () => {
      mountWithPinia({
        application: {
          applicationType: 'N/A',
          latestProgramYearId: '1111',
        },
        ...authWithDownloadPerm,
      });
      cy.contains('Status: Submitted');
    });

    it('should display `View Recent Application` button when clicked navigate to organization info [GROUP]', () => {
      mountWithPinia({
        ...createAuthStore({}, { isAuthenticated: true, permissions: [PERMISSIONS.VIEW_SUBMITTED_PCF] }),
        application: {
          applicationType: 'NEW',
          applicationStatus: 'SUBMITTED',
          programYearId,
        },
        organization: {
          organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.DOWNLOAD_PCF_PDF, PERMISSIONS.VIEW_SUBMITTED_PCF] }),
      });

      checkButtonAndNavigate('View Recent Application', pcfUrl(PATHS.CCOF_GROUP_ORG, programYearId));
    });

    it('should display `View Recent Application` button when clicked navigate to license upload', () => {
      mountWithPinia({
        ...createAuthStore({}, { isAuthenticated: true, permissions: [PERMISSIONS.VIEW_SUBMITTED_PCF] }),
        application: {
          applicationType: 'RENEW',
          applicationStatus: 'SUBMITTED',
          ccofApplicationStatus: 'ACTIVE',
          programYearId,
        },
        organization: {
          organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.DOWNLOAD_PCF_PDF, PERMISSIONS.VIEW_SUBMITTED_PCF] }),
      });

      checkButtonAndNavigate('View Recent Application', pcfUrl(PATHS.LICENSE_UPLOAD, programYearId));
    });

    it('should not display `View Recent Application` button with invalid permissions', () => {
      const permWithoutViewSubmittedPCF = Object.values(PERMISSIONS).filter(
        (permission) => permission !== PERMISSIONS.VIEW_SUBMITTED_PCF,
      );

      mountWithPinia({
        ...createAuthStore({}, { isAuthenticated: true, permissions: [permWithoutViewSubmittedPCF] }),
        application: {
          applicationType: 'RENEW',
          applicationStatus: 'SUBMITTED',
          ccofApplicationStatus: 'ACTIVE',
          programYearId,
        },
        organization: {
          organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
        },
      });
      cy.contains('button', 'View Recent Application').should('not.exist');
    });

    it('should display `View submission history` button', () => {
      mountWithPinia({
        application: {
          applicationType: 'RENEW',
          applicationMap: new Map([['key', { applicationStatus: 'SUBMITTED' }]]),
        },
        app: {
          programYearList: {
            list: [],
          },
        },
        ...authWithDownloadPerm,
      });
      cy.contains('View submission history');
    });
  });

  context('Renew my Funding Agreement Card', () => {
    const createRenPCFPerm = { auth: { permissions: [PERMISSIONS.CREATE_RENEWAL_PCF] } };

    it('should not render card if no create renewal pcf permissions', () => {
      const permWithoutCreateRenPCF = Object.values(PERMISSIONS).filter(
        (permission) => permission !== PERMISSIONS.CREATE_RENEWAL_PCF,
      );
      mountWithPinia({
        auth: {
          permissions: permWithoutCreateRenPCF,
        },
      });
      cy.contains('p', 'Renew my Funding Agreement').should('not.exist');
    });
    it('should disable `Renew my Funding Agreement` card', () => {
      mountWithPinia({
        application: {
          applicationType: APPLICATION_TYPES.NEW_ORG,
          applicationStatus: APPLICATION_STATUSES.DRAFT,
        },
        ...createRenPCFPerm,
      });
      cy.contains('p', 'Renew my Funding Agreement').should('have.css', 'pointer-events', 'none');
      cy.contains('p', 'Current providers must renew their Funding Agreement every year.')
        .should('exist')
        .should('have.css', 'pointer-events', 'none');
    });

    it('should enable `Renew my Funding Agreement` card', () => {
      mountWithPinia({
        application: {
          applicationType: APPLICATION_TYPES.RENEWAL,
          applicationStatus: APPLICATION_STATUSES.DRAFT,
        },
        ...createRenPCFPerm,
      });
      cy.contains('p', 'Current providers must renew their Funding Agreement every year.')
        .should('exist')
        .should('not.have.css', 'pointer-events', 'none');
    });

    it('should render `We will contact you` message', () => {
      mountWithPinia({
        application: {
          applicationType: APPLICATION_TYPES.RENEWAL,
          applicationStatus: '',
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.CREATE_RENEWAL_PCF] }),
      });
      cy.contains('span', 'We will contact you if we require further information.');
    });

    it('should render `Continue Renewal` button', () => {
      mountWithPinia({
        application: {
          applicationType: APPLICATION_TYPES.RENEWAL,
          applicationStatus: APPLICATION_STATUSES.DRAFT,
          programYearId,
        },
        ...createRenPCFPerm,
      });

      checkButtonAndNavigate('Continue Renewal', pcfUrl(PATHS.LICENSE_UPLOAD, programYearId));
    });

    it('should render `Update Your PCF` button', () => {
      mountWithPinia({
        application: {
          applicationType: APPLICATION_TYPES.RENEWAL,
          applicationStatus: APPLICATION_STATUSES.SUBMITTED,
          unlockDeclaration: true,
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.CREATE_RENEWAL_PCF] }),
      });
      cy.contains('button', 'Update your PCF');
    });
  });

  context('Request a Change Card', () => {
    it('should not render `Request a change` card without view change req permissions', () => {
      const permWithoutViewCR = Object.values(PERMISSIONS).filter((permission) => permission !== PERMISSIONS.VIEW_A_CR);

      mountWithPinia({
        reportChanges: {
          changeRequestStore: [{ externalStatus: CHANGE_REQUEST_EXTERNAL_STATUS.ACTION_REQUIRED }],
        },
        ...createAuthStore({}, { permissions: permWithoutViewCR }),
      });

      cy.contains('p', 'Request a change').should('not.exist');
    });
    it('should disable `Request a change` card', () => {
      mountWithPinia({
        application: {
          applicationType: '',
        },
        reportChanges: {
          changeRequestStore: [{ externalStatus: CHANGE_REQUEST_EXTERNAL_STATUS.ACTION_REQUIRED }],
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.VIEW_A_CR] }),
      });

      cy.contains('p', 'Request a change').should('exist').should('have.css', 'pointer-events', 'none');
    });

    it('should enable `Request a change` card when application type is renew and organizationAccountNumber exists', () => {
      mountWithPinia({
        application: {
          applicationType: APPLICATION_TYPES.RENEWAL,
        },
        organization: {
          organizationAccountNumber,
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.VIEW_A_CR] }),
      });
      cy.contains('p', 'Request a change').should('not.have.css', 'pointer-events', 'none');
    });

    it('should enable `Request a change` button and navigate to request history on click', () => {
      const expectedPath = `${PATHS.ROOT.CHANGE_LANDING}#change-request-history`;
      mountWithPinia({
        application: {
          applicationType: APPLICATION_TYPES.RENEWAL,
        },
        organization: {
          organizationAccountNumber,
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.VIEW_A_CR] }),
      });

      checkButtonAndNavigate('Request a change', expectedPath);
    });

    it('should enable `Update change request` button and navigate to request history on click', () => {
      const expectedPath = `${PATHS.ROOT.CHANGE_LANDING}#change-request-history`;
      mountWithPinia({
        application: {
          applicationType: APPLICATION_TYPES.RENEWAL,
        },
        organization: {
          organizationAccountNumber,
        },
        reportChanges: {
          changeRequestStore: [{ externalStatus: CHANGE_REQUEST_EXTERNAL_STATUS.ACTION_REQUIRED }],
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.VIEW_A_CR, PERMISSIONS.ORGANIZATION_CHANGE] }),
      });

      checkButtonAndNavigate('Update change request', expectedPath);
    });

    it('should not render `Update change request` button without proper permissions', () => {
      const perms = Object.values(PERMISSIONS).filter(
        (permission) =>
          permission !== PERMISSIONS.MTFI &&
          permission !== PERMISSIONS.ORGANIZATION_CHANGE &&
          permission !== PERMISSIONS.ADD_NEW_FACILITY &&
          permission !== PERMISSIONS.LICENCE_CHANGE &&
          permission !== PERMISSIONS.OTHER_CHANGES,
      );

      mountWithPinia({
        application: {
          applicationType: APPLICATION_TYPES.RENEWAL,
        },
        organization: {
          organizationAccountNumber,
        },
        reportChanges: {
          changeRequestStore: [{ externalStatus: CHANGE_REQUEST_EXTERNAL_STATUS.ACTION_REQUIRED }],
        },
        ...createAuthStore({}, { permissions: perms }),
      });
      cy.contains('button', 'Update change request').should('not.exist');
    });
  });

  context('Submit Enrolment Reports Card', () => {
    it('should not display `Submit Enrolment Reports` card without proper permissions', () => {
      const permWithoutViewER = Object.values(PERMISSIONS).filter((permission) => permission !== PERMISSIONS.VIEW_ER);

      mountWithPinia({
        application: {
          applicationType: '',
          applicationMap: new Map(),
        },
        ...createAuthStore({ permissions: [permWithoutViewER] }),
      });

      cy.contains('p', 'Submit Enrolment Reports or monthly ECE reports to receive funding').should('not.exist');
    });

    it('should display `Submit Enrolment Reports` card (disabled) with proper permissions', () => {
      mountWithPinia({
        application: {
          applicationType: '',
          applicationMap: new Map(),
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.VIEW_ER] }),
      });

      cy.contains('p', 'Submit Enrolment Reports or monthly ECE reports to receive funding').should('exist');
    });

    it('should disable `Submit Enrolment Reports` card when CCOF not approved', () => {
      mountWithPinia({
        application: {
          applicationType: '',
          applicationMap: new Map(),
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.VIEW_ER] }),
      });

      cy.contains('p', 'Submit Enrolment Reports or monthly ECE reports to receive funding').should(
        'have.css',
        'pointer-events',
        'none',
      );
    });

    it('should disable `Submit Enrolment Reports` card when action required applications exist', () => {
      mountWithPinia({
        app: {
          latestProgramYearId: '1111',
          programYearList: {
            list: [
              {
                programYearId: '1111',
                name: '2024/2025 CCOF Program',
                order: 5,
              },
              {
                programYearId: '2222',
                name: '2025/2026 CCOF Program',
                order: 6,
              },
            ],
          },
        },
        application: {
          applicationType: 'NEW',
          latestProgramYearId: '1111',
          applicationMap: new Map([
            [
              '2222',
              {
                ccofProgramYearId: '2222',
                applicationType: APPLICATION_TYPES.NEW_ORG,
                unlockDeclaration: true,
              },
            ],
          ]),
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.VIEW_ER] }),
      });

      cy.contains('p', 'Submit Enrolment Reports or monthly ECE reports to receive funding').should(
        'have.css',
        'pointer-events',
        'none',
      );
    });

    it('should enable `Submit Enrolment Reports` card when CCOF approved and no action required', () => {
      mountWithPinia({
        application: {
          applicationType: APPLICATION_TYPES.RENEWAL,
          applicationMap: new Map(),
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.VIEW_ER] }),
      });

      cy.contains('p', 'Submit Enrolment Reports or monthly ECE reports to receive funding').should(
        'not.have.css',
        'pointer-events',
        'none',
      );
    });

    it('should redirect on clicking the `Manage Reports` button when enabled', () => {
      mountWithPinia({
        application: {
          applicationType: APPLICATION_TYPES.RENEWAL,
          applicationMap: new Map(),
        },
        ...createAuthStore({}, { permissions: [PERMISSIONS.VIEW_ER] }),
      });

      checkButtonAndNavigate('Manage Reports', PATHS.ROOT.MANAGE_REPORTS);
    });
  });

  context('Manage Organization and Facilities card', () => {
    it('should not display `Manage Organization and Facilities` card without proper permissions', () => {
      const permWithoutViewOrgInfo = Object.values(PERMISSIONS).filter(
        (permission) => permission !== PERMISSIONS.VIEW_ORG_INFORMATION,
      );

      mountWithPinia({
        auth: {
          isAuthenticated: true,
          userInfo: {
            serverTime: new Date(),
          },
          permissions: [permWithoutViewOrgInfo],
        },
      });

      cy.contains('p', 'Manage Organization and Facilities').should('not.exist');
      cy.contains('p', 'View or update your organization, facility details, and funding agreement.').should(
        'not.exist',
      );
    });

    it('should display `Manage Organization and Facilities` card (disabled) with proper permissions', () => {
      mountWithPinia({
        auth: {
          isAuthenticated: true,
          userInfo: {
            serverTime: new Date(),
          },
          permissions: [PERMISSIONS.VIEW_ORG_INFORMATION],
        },
      });

      cy.contains('p', 'Manage Organization and Facilities');
      cy.contains('p', 'View or update your organization, facility details, and funding agreement.').should(
        'have.css',
        'pointer-events',
        'none',
      );
    });

    it('should display `Manage Organization and Facilities` card (enabled)', () => {
      mountWithPinia({
        auth: {
          isAuthenticated: true,
          userInfo: {
            serverTime: new Date(),
          },
          permissions: [PERMISSIONS.VIEW_ORG_INFORMATION],
        },
        organization: {
          organizationAccountNumber: '12345',
        },
      });

      cy.contains('p', 'Manage Organization and Facilities');
      cy.contains('p', 'View or update your organization, facility details, and funding agreement.').should(
        'not.have.css',
        'pointer-events',
        'none',
      );
      cy.contains('button', 'Manage Organization and Facilities').click();
      cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.MANAGE_ORG_FACILITIES);
    });
  });

  context('Manage Users Card', () => {
    it('should not render `Manage User` card when no proper permissions', () => {
      const permWithoutViewUsers = Object.values(PERMISSIONS).filter(
        (permission) => permission !== PERMISSIONS.VIEW_USERS,
      );
      mountWithPinia({
        organization: {
          organizationAccountNumber: null,
        },
        auth: {
          isAuthenticated: true,
          userInfo: {
            serverTime: new Date(),
          },
          permissions: [permWithoutViewUsers],
        },
      });

      cy.contains('button', 'Manage Users').should('not.exist');
    });

    it('should disable `Manage User` card when no organization account number', () => {
      mountWithPinia({
        organization: {
          organizationAccountNumber: null,
        },
        auth: {
          isAuthenticated: true,
          userInfo: {
            serverTime: new Date(),
          },
          permissions: [PERMISSIONS.VIEW_USERS],
        },
      });

      cy.contains('button', 'Manage Users').should('have.css', 'pointer-events', 'none');
    });

    it('should redirect when clicking `Manage User` button to maintain users page', () => {
      mountWithPinia({
        organization: {
          organizationAccountNumber,
        },
        auth: {
          isAuthenticated: true,
          userInfo: {
            serverTime: new Date(),
          },
          permissions: [PERMISSIONS.VIEW_USERS],
        },
      });

      checkButtonAndNavigate('Manage Users', PATHS.ROOT.MANAGE_USERS);
    });
  });

  it('should display program year name for facility cards funding agreement`', () => {
    const programYearLabel = '2025-XX';
    mountWithPinia({
      navBar,
      application: {
        programYearLabel,
        programYearId,
      },
      ...createAuthStore({}, { permissions: [PERMISSIONS.CREATE_NEW_APPLICATION] }),
    });

    cy.contains('h2', `Fiscal Year: 2025`);
  });

  it('should not display program year name for facility cards funding agreement if no permissions', () => {
    const permWithoutShowFacility = Object.values(PERMISSIONS).filter(
      (permission) =>
        permission !== PERMISSIONS.CREATE_NEW_APPLICATION &&
        permission !== PERMISSIONS.CREATE_RENEWAL_PCF &&
        permission !== PERMISSIONS.VIEW_SUBMITTED_PCF &&
        permission !== PERMISSIONS.VIEW_CLOSURES,
    );

    const programYearLabel = '2025-XX';
    mountWithPinia({
      navBar,
      application: {
        programYearLabel,
        programYearId,
      },
      ...createAuthStore({}, { permissions: permWithoutShowFacility }),
    });

    cy.contains('h2', `Fiscal Year: 2025`).should('not.exist');
  });

  it('should render funding agreement number when available', () => {
    const fundingAgreementNumber = '9999';
    mountWithPinia({
      navBar,
      application: {
        programYearId,
        applicationMap: new Map([[programYearId, { fundingAgreementNumber }]]),
      },
      ...createAuthStore({}, { permissions: [PERMISSIONS.VIEW_CLOSURES] }),
    });

    cy.contains('h2', `Funding Agreement Number: ${fundingAgreementNumber}`);
  });

  it('should not render funding agreement number when not available', () => {
    mountWithPinia({
      navBar,
      application: {
        programYearId,
      },
      ...createAuthStore({}, { permissions: [PERMISSIONS.VIEW_SUBMITTED_PCF] }),
    });

    cy.contains('h2', 'Funding Agreement Number:').should('not.exist');
  });

  it('should not render `Organization Closures` button', () => {
    mountWithPinia({
      navBar,
      application: {
        applicationMap: new Map(),
        programYearId,
      },
      ...createAuthStore({}, { permissions: [PERMISSIONS.CREATE_RENEWAL_PCF] }),
    });

    cy.contains('button', 'Organization Closures').should('not.exist');
  });

  it('should not render search box for facility filter', () => {
    mountWithPinia({
      navBar,
      application: {
        programYearId,
        applicationMap: new Map(),
      },
      ...createAuthStore({}, { permissions: [PERMISSIONS.CREATE_NEW_APPLICATION] }),
    });

    cy.contains('label', 'Filter by Facility Name').should('not.exist');
  });

  it('should render search box for facility filter', () => {
    mountWithPinia({
      navBar,
      application: {
        programYearId,
        applicationMap: new Map([
          [programYearId, { ccofProgramYearId: programYearId, facilityList: [{ a: 'a' }, { b: 'b' }, { c: 'c' }] }],
        ]),
      },
      ...createAuthStore({}, { permissions: [PERMISSIONS.CREATE_NEW_APPLICATION] }),
    });

    cy.contains('label', 'Filter by Facility Name');
  });

  it('should render slider and display program year name sliced within slider', () => {
    const testName1 = '2022/2023 CCOF Program';
    const testName2 = '2023/2024 CCOF Program';
    const testName3 = '2024/2025 CCOF Program';

    mountWithPinia({
      navBar,
      application: {
        programYearId,
        applicationMap: new Map([
          ['a', { applicationId: '1', ccofProgramYearName: `${testName1}!!!` }],
          ['b', { applicationId: '2', ccofProgramYearName: `${testName2}!!!` }],
          ['c', { applicationId: '3', ccofProgramYearName: `${testName3}!!!` }],
        ]),
      },
      auth: { permissions: [PERMISSIONS.CREATE_NEW_APPLICATION] },
    });

    cy.contains('h3', 'Select fiscal year:');
    cy.contains(testName1);
    cy.contains(testName2);
    cy.contains(testName3);
  });

  context('Facility Card', () => {
    const createPermisions = () => ({
      auth: {
        permissions: [
          PERMISSIONS.CREATE_NEW_APPLICATION,
          PERMISSIONS.CREATE_RENEWAL_PCF,
          PERMISSIONS.VIEW_SUBMITTED_PCF,
        ],
      },
    });

    const createApplicationMap = (facilityOverrides = {}, additionalProps = {}) => {
      return new Map([
        [
          programYearId,
          {
            applicationId: '1',
            ccofProgramYearName: `$aaa!!!`,
            ccofProgramYearId: programYearId,
            ...additionalProps,
            facilityList: [
              {
                facilityId: '1',
                facilityAccountNumber,
                facilityName,
                licenseNumber,
                ccfriApplicationId,
                ...facilityOverrides,
              },
            ],
          },
        ],
      ]);
    };

    it('should not render facility details without the required permissions', () => {
      const permWithoutRequired = Object.values(PERMISSIONS).filter(
        (permission) =>
          permission !== PERMISSIONS.CREATE_NEW_APPLICATION &&
          permission !== PERMISSIONS.CREATE_RENEWAL_PCF &&
          permission !== PERMISSIONS.VIEW_SUBMITTED_PCF,
      );

      mountWithPinia({
        navBar,
        application: {
          programYearId,
          applicationMap: createApplicationMap(),
        },
        auth: {
          permissions: permWithoutRequired,
        },
      });
      cy.contains('p', `Facility ID: ${facilityAccountNumber}`).should('not.exist');
    });

    it('should render facility details', () => {
      mountWithPinia({
        navBar,
        application: {
          programYearId,
          applicationMap: createApplicationMap(),
        },
        ...createPermisions(),
      });
      cy.contains('p', `Facility ID: ${facilityAccountNumber}`);
      cy.contains('p', `Facility Name: ${facilityName}`);
      cy.contains('p', `Licence Number: ${licenseNumber}`);
    });

    it('should display `OPTED OUT` status `Child Care Fee Reduction Initiative` ', () => {
      mountWithPinia({
        navBar,
        application: {
          programYearId,
          applicationMap: createApplicationMap({ ccfriOptInStatus: 0 }),
        },
        ...createPermisions(),
      });
      cy.contains('p', 'Child Care Fee Reduction Initiative (CCFRI) Status: OPTED OUT');
    });

    it('should return the facility default ccfriStatus when opt-in status not 0 and no MTFI change request', () => {
      const ccfriStatus = 'TEST_STATUS';

      mountWithPinia({
        navBar,
        application: {
          programYearId,
          applicationMap: createApplicationMap({ ccfriStatus }),
        },
        ...createPermisions(),
      });
      cy.contains('p', `Child Care Fee Reduction Initiative (CCFRI) Status: ${ccfriStatus}`);
    });

    it('should return `OPTED OUT` (ECE-WE) Status when opt-out', () => {
      mountWithPinia({
        navBar,
        application: {
          programYearId,
          applicationMap: createApplicationMap({ eceweOptInStatus: 0 }),
        },
        ...createPermisions(),
      });
      cy.contains('p', `Early Childhood Educator Wage Enhancement (ECE-WE) Status: OPTED OUT`);
    });

    it('should return the facility (ECE-WE) Status when opted-in', () => {
      const eceweStatus = 'TEST_STATUS_123';

      mountWithPinia({
        navBar,
        application: {
          programYearId,
          applicationMap: createApplicationMap({ eceweStatus }),
        },
        ...createPermisions(),
      });
      cy.contains('p', `Early Childhood Educator Wage Enhancement (ECE-WE) Status: ${eceweStatus}`);
    });

    it('should render `Update your PCF` button when unlockNmf and navigate current fees and navigate', () => {
      mountWithPinia({
        navBar,
        application: {
          programYearId,
          applicationMap: createApplicationMap(
            { unlockNmf: true },
            { applicationStatus: APPLICATION_STATUSES.SUBMITTED },
          ),
        },
        ...createPermisions(),
      });

      checkButtonAndNavigate(`Update your PCF`, pcfUrlGuid(PATHS.CCFRI_NMF, programYearId, ccfriApplicationId));
    });

    it('should render `Update your PCF` button when isCCFRIUnlock and navigate to current fees', () => {
      mountWithPinia({
        navBar,
        application: {
          programYearId,
          applicationMap: createApplicationMap(
            { unlockCcfri: true },
            { applicationStatus: APPLICATION_STATUSES.SUBMITTED, isRenewal: true },
          ),
        },
        ...createPermisions(),
      });

      checkButtonAndNavigate(
        `Update your PCF`,
        pcfUrlGuid(PATHS.CCFRI_CURRENT_FEES, programYearId, ccfriApplicationId),
      );
    });

    it('should render `Update your PCF` button when isCCFRIUnlock and navigate to new fees', () => {
      mountWithPinia({
        navBar,
        application: {
          programYearId,
          applicationMap: createApplicationMap(
            { unlockCcfri: true },
            { applicationStatus: APPLICATION_STATUSES.SUBMITTED },
          ),
        },
        ...createPermisions(),
      });

      checkButtonAndNavigate(`Update your PCF`, pcfUrlGuid(PATHS.CCFRI_NEW_FEES, programYearId, ccfriApplicationId));
    });

    it('should render `Update your PCF` button when isRFIUnlock and navigate to CCFRI RFI', () => {
      mountWithPinia({
        navBar,
        application: {
          programYearId,
          applicationMap: createApplicationMap(
            { unlockRfi: true },
            { applicationStatus: APPLICATION_STATUSES.SUBMITTED },
          ),
        },
        ...createPermisions(),
      });

      checkButtonAndNavigate(`Update your PCF`, pcfUrlGuid(PATHS.CCFRI_RFI, programYearId, ccfriApplicationId));
    });

    it('should render `Update your PCF` button when isAFSUnlock', () => {
      mountWithPinia({
        navBar,
        application: {
          programYearId,
          applicationMap: createApplicationMap(
            { unlockAfs: true, enableAfs: true },
            { applicationStatus: APPLICATION_STATUSES.SUBMITTED },
          ),
        },
        ...createPermisions(),
      });

      checkButtonAndNavigate(`Update your PCF`, pcfUrlGuid(PATHS.CCFRI_AFS, programYearId, ccfriApplicationId));
    });

    it('should not render `Update your PCF` button when application status not submitted', () => {
      mountWithPinia({
        navBar,
        application: {
          programYearId,
          applicationMap: createApplicationMap(
            { unlockAfs: true, enableAfs: true },
            { applicationStatus: APPLICATION_STATUSES.DRAFT },
          ),
        },
        ...createPermisions(),
      });
      cy.contains('button', `Update your PCF`).should('not.exist');
    });
  });
});
