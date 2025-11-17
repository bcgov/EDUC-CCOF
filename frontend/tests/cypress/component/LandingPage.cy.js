import LandingPage from '@/components/LandingPage.vue';
import vuetify from '@/plugins/vuetify';
import {
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

  it('should display CCOF text when approved and no actions required', () => {
    mountWithPinia({
      application: {
        applicationType: 'RENEW',
        applicationMap: new Map(),
      },
      ...createAuthStore(),
    });

    cy.contains('Child Care Operating Funding (CCOF)').should('exist');
    cy.contains('Apply for Child Care Operating Funding (CCOF)').should('not.exist');
  });

  it('should display `apply CCOF` when not approved', () => {
    mountWithPinia({
      application: {
        applicationType: '',
      },
    });
    cy.contains('Apply for Child Care Operating Funding (CCOF)').should('exist');
    cy.contains('CCOF Base Funding');
    cy.contains('Child Care Fee Reduction Initiative (CCFRI) Funding');
    cy.contains('Early Childhood Educator Wage Enhancement (ECE-WE) Funding');
  });

  it('should display only `new application text` titles when not approved and not new', () => {
    mountWithPinia({
      application: {
        applicationType: 'NEW',
        applicationStatus: 'SUBMITTED',
      },
    });
    cy.contains('CCOF Base Funding');
    cy.contains('Child Care Fee Reduction Initiative (CCFRI) Funding');
    cy.contains('Early Childhood Educator Wage Enhancement (ECE-WE) Funding');

    cy.contains('Base Funding assists eligible licensed family and group child care providers').should('not.exist');
    cy.contains('The CCFRI offers funding to eligible, licensed child care providers to reduce and stabilize').should(
      'not.exist',
    );
    cy.contains('Providers with licensed care facilities can apply for a wage enhancement for Early Childhood').should(
      'not.exist',
    );
  });

  it('should display `new application` text and body', () => {
    mountWithPinia({
      application: {
        applicationType: '',
      },
    });
    cy.contains('CCOF Base Funding');
    cy.contains('Child Care Fee Reduction Initiative (CCFRI) Funding');
    cy.contains('Early Childhood Educator Wage Enhancement (ECE-WE) Funding');

    cy.contains('Base Funding assists eligible licensed family and group child care providers').should('exist');
    cy.contains('The CCFRI offers funding to eligible, licensed child care providers to reduce and stabilize').should(
      'exist',
    );
    cy.contains('Providers with licensed care facilities can apply for a wage enhancement for Early Childhood').should(
      'exist',
    );
  });

  it('should not display `new application` data', () => {
    mountWithPinia({
      application: {
        applicationType: 'RENEW',
      },
      ...createAuthStore(),
    });
    cy.contains('CCOF Base Funding').should('not.exist');
    cy.contains('Child Care Fee Reduction Initiative (CCFRI) Funding').should('not.exist');
    cy.contains('Early Childhood Educator Wage Enhancement (ECE-WE) Funding').should('not.exist');

    cy.contains('Base Funding assists eligible licensed family and group child care providers').should('not.exist');
    cy.contains('The CCFRI offers funding to eligible, licensed child care providers to reduce and stabilize').should(
      'not.exist',
    );
    cy.contains('Providers with licensed care facilities can apply for a wage enhancement for Early Childhood').should(
      'not.exist',
    );
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
    });

    checkButtonAndNavigate('Start Application', pcfUrl(PATHS.NEW_APPLICATION_INTERMEDIATE, programYearId));
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
    });
    cy.contains('Status of your funding agreement for the current fiscal year: Active');
  });

  it('should display `submit` status for submitted funding agreement', () => {
    mountWithPinia({
      application: {
        applicationType: 'N/A',
        latestProgramYearId: '1111',
      },
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
      ...createAuthStore(),
    });
    cy.contains('View submission history');
  });

  context('Renew my Funding Agreement Card', () => {
    it('should disable `Renew my Funding Agreement` card', () => {
      mountWithPinia({
        application: {
          applicationType: 'NEW',
          applicationStatus: 'DRAFT',
        },
      });
      cy.contains('p', 'Renew my Funding Agreement').should('have.css', 'pointer-events', 'none');
      cy.contains('p', 'Current providers must renew their Funding Agreement every year.')
        .should('exist')
        .should('have.css', 'pointer-events', 'none');
    });

    it('should enable `Renew my Funding Agreement` card', () => {
      mountWithPinia({
        application: {
          applicationType: 'RENEW',
          applicationStatus: 'DRAFT',
        },
      });
      cy.contains('p', 'Renew my Funding Agreement').should('not.have.css', 'pointer-events', 'none');
      cy.contains('p', 'Current providers must renew their Funding Agreement every year.')
        .should('exist')
        .should('not.have.css', 'pointer-events', 'none');
    });

    it('should render `We will contact you` message', () => {
      mountWithPinia({
        application: {
          applicationType: 'RENEW',
          applicationStatus: '',
        },
        ...createAuthStore(),
      });
      cy.contains('span', 'We will contact you if we require further information.');
    });

    it('should render `Continue Renewal` button', () => {
      mountWithPinia({
        application: {
          applicationType: 'RENEW',
          applicationStatus: 'DRAFT',
          programYearId,
        },
      });

      checkButtonAndNavigate('Continue Renewal', pcfUrl(PATHS.LICENSE_UPLOAD, programYearId));
    });

    it('should render `Update Your PCF` button', () => {
      mountWithPinia({
        application: {
          applicationType: 'RENEW',
          applicationStatus: 'SUBMITTED',
          unlockDeclaration: true,
        },
        ...createAuthStore(),
      });
      cy.contains('button', 'Update your PCF');
    });
  });

  context('Request a Change Card', () => {
    it('should disable `Request a change` card', () => {
      mountWithPinia({
        application: {
          applicationType: '',
        },
        reportChanges: {
          changeRequestStore: [{ externalStatus: CHANGE_REQUEST_EXTERNAL_STATUS.ACTION_REQUIRED }],
        },
        ...createAuthStore(),
      });

      cy.contains('p', 'Request a change').should('exist').should('have.css', 'pointer-events', 'none');
    });

    it('should enable `Request a change` card when application type is renew and organizationAccountNumber exists', () => {
      mountWithPinia({
        application: {
          applicationType: 'RENEW',
        },
        organization: {
          organizationAccountNumber,
        },
        ...createAuthStore(),
      });
      cy.contains('p', 'Request a change').should('not.have.css', 'pointer-events', 'none');
    });

    it('should enable `Request a change` button and navigate to request history on click', () => {
      const expectedPath = `${PATHS.ROOT.CHANGE_LANDING}#change-request-history`;
      mountWithPinia({
        application: {
          applicationType: 'RENEW',
        },
        organization: {
          organizationAccountNumber,
        },
        ...createAuthStore(),
      });

      checkButtonAndNavigate('Request a change', expectedPath);
    });

    it('should enable `Update change request` button and navigate to request history on click', () => {
      const expectedPath = `${PATHS.ROOT.CHANGE_LANDING}#change-request-history`;
      mountWithPinia({
        application: {
          applicationType: 'RENEW',
        },
        organization: {
          organizationAccountNumber,
        },
        reportChanges: {
          changeRequestStore: [{ externalStatus: CHANGE_REQUEST_EXTERNAL_STATUS.ACTION_REQUIRED }],
        },
        ...createAuthStore(),
      });

      checkButtonAndNavigate('Update change request', expectedPath);
    });
  });

  context('Submit Enrolment Reports Card', () => {
    it('should disable `Submit Enrolment Reports` card when CCOF not approved', () => {
      mountWithPinia({
        application: {
          applicationType: '',
          applicationMap: new Map(),
        },
        ...createAuthStore(),
      });

      cy.contains('p', 'Submit Enrolment Reports or monthly ECE reports to receive funding').should(
        'have.css',
        'pointer-events',
        'none',
      );
    });

    it('should redirect on clicking the `Manage Reports` button when enabled', () => {
      mountWithPinia({
        application: {
          applicationType: 'RENEW',
          applicationMap: new Map(),
        },
        ...createAuthStore(),
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

      cy.contains('p', 'Manage Organization and Facilitie').should('not.exist');
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

      cy.contains('p', 'Manage Organization and Facilitie');
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

      cy.contains('p', 'Manage Organization and Facilitie');
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
    });

    cy.contains('h2', `Fiscal Year: 2025`);
  });

  it('should render funding agreement number when available', () => {
    const fundingAgreementNumber = '9999';
    mountWithPinia({
      navBar,
      application: {
        programYearId,
        applicationMap: new Map([[programYearId, { fundingAgreementNumber }]]),
      },
    });

    cy.contains('h2', `Funding Agreement Number: ${fundingAgreementNumber}`);
  });

  it('should not render funding agreement number when not available', () => {
    mountWithPinia({
      navBar,
      application: {
        programYearId,
      },
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
    });

    cy.contains('h3', 'Select fiscal year:');
    cy.contains(testName1);
    cy.contains(testName2);
    cy.contains(testName3);
  });

  context('Facility Card', () => {
    const createAppStore = () => ({
      app: {
        programYearList: {
          list: [
            {
              programYearId: '101',
              order: 5,
            },
          ],
        },
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

    it('should render facility details', () => {
      mountWithPinia({
        navBar,
        application: {
          programYearId,
          applicationMap: createApplicationMap(),
        },
        ...createAppStore(),
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
        ...createAppStore(),
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
        ...createAppStore(),
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
        ...createAppStore(),
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
        ...createAppStore(),
      });
      cy.contains('p', `Early Childhood Educator Wage Enhancement (ECE-WE) Status: ${eceweStatus}`);
    });

    it('should render `Update your PCF` button when unlockNmf and navigate current fees and navigate', () => {
      mountWithPinia({
        navBar,
        application: {
          programYearId,
          applicationMap: createApplicationMap({ unlockNmf: true }, { applicationStatus: 'SUBMITTED' }),
        },
        ...createAppStore(),
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
            { applicationStatus: 'SUBMITTED', isRenewal: true },
          ),
        },
        ...createAppStore(),
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
          applicationMap: createApplicationMap({ unlockCcfri: true }, { applicationStatus: 'SUBMITTED' }),
        },
        ...createAppStore(),
      });

      checkButtonAndNavigate(`Update your PCF`, pcfUrlGuid(PATHS.CCFRI_NEW_FEES, programYearId, ccfriApplicationId));
    });

    it('should render `Update your PCF` button when isRFIUnlock and navigate to CCFRI RFI', () => {
      mountWithPinia({
        navBar,
        application: {
          programYearId,
          applicationMap: createApplicationMap({ unlockRfi: true }, { applicationStatus: 'SUBMITTED' }),
        },
        ...createAppStore(),
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
            { applicationStatus: 'SUBMITTED' },
          ),
        },
        ...createAppStore(),
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
            { applicationStatus: 'NOT_SUBMITTED' },
          ),
        },
        ...createAppStore(),
      });
      cy.contains('button', `Update your PCF`).should('not.exist');
    });
  });
});
