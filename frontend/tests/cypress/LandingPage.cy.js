import LandingPage from '@/components/LandingPage.vue';
import vuetify from '@/plugins/vuetify';
import {
  CHANGE_REQUEST_EXTERNAL_STATUS,
  ORGANIZATION_GOOD_STANDING_STATUSES,
  ORGANIZATION_PROVIDER_TYPES,
  PATHS,
  pcfUrl,
} from '@/utils/constants.js';

describe('<LandingPage />', () => {
  function mountWithPinia(initialState = {}, dateOverride = {}) {
    cy.setupPinia({ initialState }).then((pinia) => {
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

  it('should display organization id and name', () => {
    mountWithPinia({
      organization: {
        organizationAccountNumber: 'ORG-12345',
        organizationName: 'Test Organization',
      },
    });

    cy.contains('Organization ID: ORG-12345').should('exist');
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
      auth: {
        userInfo: {
          organizationGoodStandingStatus: '',
          organizationBypassGoodStandingCheck: true,
        },
      },
    });

    cy.contains('Your organization is not in good standing with BC Registries and Online Services.').should(
      'not.exist',
    );
  });

  it('should display app alert if not good standing', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          organizationGoodStandingStatus: ORGANIZATION_GOOD_STANDING_STATUSES.FAIL,
          organizationBypassGoodStandingCheck: false,
        },
      },
    });

    cy.contains('Your organization is not in good standing with BC Registries and Online Services.').should('exist');
  });

  // Starting here

  it('should display CCOF text when approved and no actions required', () => {
    mountWithPinia({
      application: {
        applicationType: 'RENEW',
        applicationMap: new Map(),
      },
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
      },
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
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
      },
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
            programYearId: 'TEST_YEAR_ID',
          },
        },
      },
    });

    cy.contains('button', 'Start Application').click();
    cy.get('@routerPush').should('have.been.calledWith', pcfUrl(PATHS.NEW_APPLICATION_INTERMEDIATE, 'TEST_YEAR_ID'));
  });

  it('should display `Continue Application` and navigate to group organization', () => {
    mountWithPinia({
      application: {
        applicationType: 'NEW',
        applicationStatus: 'DRAFT',
        programYearId: 'TEST_YEAR_ID',
      },
      organization: {
        organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
      },
    });
    cy.contains('Status: Incomplete');
    cy.contains('button', 'Continue Application').click();
    cy.get('@routerPush').should('have.been.calledWith', pcfUrl(PATHS.CCOF_GROUP_ORG, 'TEST_YEAR_ID'));
  });

  it('should display `Continue Application` and navigate to family organization', () => {
    mountWithPinia({
      application: {
        applicationType: 'NEW',
        applicationStatus: 'DRAFT',
        programYearId: 'TEST_YEAR_ID',
      },
      organization: {
        organizationProviderType: ORGANIZATION_PROVIDER_TYPES.FAMILY,
      },
    });
    cy.contains('button', 'Continue Application').click();
    cy.get('@routerPush').should('have.been.calledWith', pcfUrl(PATHS.CCOF_FAMILY_ORG, 'TEST_YEAR_ID'));
  });

  // TODO: Need test if clicking button results in dialog open (*need data attributes*)
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

  it('should display `View Recent Application` button when clicked navigate to organization info [GROUP]  ', () => {
    mountWithPinia({
      application: {
        applicationType: 'NEW',
        applicationStatus: 'SUBMITTED',
        programYearId: '5555',
      },
      organization: {
        organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
      },
    });
    cy.contains('button', 'View Recent Application').click();
    cy.get('@routerPush').should('have.been.calledWith', pcfUrl(PATHS.CCOF_GROUP_ORG, '5555'));
  });

  it('should display `View Recent Application` button when clicked navigate to license upload  ', () => {
    mountWithPinia({
      application: {
        applicationType: 'RENEW',
        applicationStatus: 'SUBMITTED',
        ccofApplicationStatus: 'ACTIVE',
        programYearId: '5555',
      },
      organization: {
        organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
      },
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
      },
    });
    cy.contains('button', 'View Recent Application').click();
    cy.get('@routerPush').should('have.been.calledWith', pcfUrl(PATHS.LICENSE_UPLOAD, '5555'));
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
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
      },
    });
    cy.contains('View submission history');
  });

  // TODO: Add tests for `Renew my Funding Agreement` here

  it('should disable `Requst a change` card ', () => {
    mountWithPinia({
      application: {
        applicationType: '',
      },
      reportChanges: {
        changeRequestStore: [{ externalStatus: CHANGE_REQUEST_EXTERNAL_STATUS.ACTION_REQUIRED }],
      },
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
      },
    });

    cy.contains('p', 'Request a change').should('exist').should('have.css', 'pointer-events', 'none');
  });

  it('should enable `Requst a change` card when application type is renew and organizationAccountNumber exists', () => {
    mountWithPinia({
      application: {
        applicationType: 'RENEW',
      },
      organization: {
        organizationAccountNumber: true,
      },
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
      },
    });
    cy.contains('p', 'Request a change').should('not.have.css', 'pointer-events', 'none');
  });

  it('should enable `Request a change` button and navigate to request history on click', () => {
    const expectedPath = PATHS.ROOT.CHANGE_LANDING + '#change-request-history';
    mountWithPinia({
      application: {
        applicationType: 'RENEW',
      },
      organization: {
        organizationAccountNumber: true,
      },
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
      },
    });

    cy.contains('button', 'Request a change').click();
    cy.get('@routerPush').should('have.been.calledWith', expectedPath);
  });

  it('should enable `Update change request` button and navigate to request history on click', () => {
    const expectedPath = PATHS.ROOT.CHANGE_LANDING + '#change-request-history';
    mountWithPinia({
      application: {
        applicationType: 'RENEW',
      },
      organization: {
        organizationAccountNumber: true,
      },
      reportChanges: {
        changeRequestStore: [{ externalStatus: CHANGE_REQUEST_EXTERNAL_STATUS.ACTION_REQUIRED }],
      },
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
      },
    });

    cy.contains('button', 'Update change request').click();
    cy.get('@routerPush').should('have.been.calledWith', expectedPath);
  });

  it('should disable `Submit Enrolment Reports or monthly ECE reports` card', () => {
    mountWithPinia({
      application: {
        applicationType: null,
      },
    });

    cy.contains('p', 'Submit Enrolment Reports or monthly ECE reports to receive funding').should(
      'have.css',
      'pointer-events',
      'none',
    );

    cy.contains('button', 'Submit a report').should('have.css', 'pointer-events', 'none');
  });

  it('should redirect on clicking the `Submit a report` button', () => {
    mountWithPinia({
      application: {
        applicationType: 'RENEW',
      },
      auth: {
        userInfo: {
          serverTime: new Date(),
        },
      },
    });

    cy.contains('p', 'Submit Enrolment Reports or monthly ECE reports to receive funding').should(
      'not.have.css',
      'pointer-events',
      'none',
    );

    cy.contains('button', 'Submit a report').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.ENROLMENT_REPORTS);
  });

  // TODO: TEST THIS
  // it('should display `Manage Organization and Facilities` card', () => {
  //   mountWithPinia({});
  // });

  it('should disable `Manage User` card when no organization account number', () => {
    mountWithPinia({
      organization: {
        organizationAccountNumber: null,
      },
    });

    cy.contains('button', 'Manage Users').should('have.css', 'pointer-events', 'none');
  });

  it('should redirect when clicking `Manage User` button to maintain users page', () => {
    mountWithPinia({
      organization: {
        organizationAccountNumber: '12345',
      },
    });

    cy.contains('button', 'Manage Users').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.MANAGE_USERS);
  });

  it('should display program year name for facility cards funding agreement`', () => {
    const programYearLabel = '2025-XX';
    mountWithPinia({
      navBar: {
        navBarList: ['a', 'b', 'c'],
      },
      application: {
        programYearLabel,
        programYearId: '1234',
      },
    });

    cy.contains('h2', `Fiscal Year: 2025`);
  });

  it('should render funding agreement number when available', () => {
    const programYearId = '12345';
    const fundingAgreementNumber = '9999';
    mountWithPinia({
      navBar: {
        navBarList: ['a'],
      },
      application: {
        programYearId,
        applicationMap: new Map([[programYearId, { fundingAgreementNumber }]]),
      },
    });

    cy.contains('h2', `Funding Agreement Number: ${fundingAgreementNumber}`);
  });

  it('should not render funding agreement number when not available', () => {
    mountWithPinia({
      navBar: {
        navBarList: ['a'],
      },
      application: {
        programYearId: '1234',
      },
    });

    cy.contains('h2', 'Funding Agreement Number:').should('not.exist');
  });

  it('should not render `Organization Closures` button', () => {
    mountWithPinia({
      navBar: {
        navBarList: ['a'],
      },
      application: {
        applicationMap: new Map(),
        programYearId: '1234',
      },
    });

    cy.contains('button', 'Organization Closures').should('not.exist');
  });

  // it('should render `Organization Closures` button', () => {
  //   const programYearId = '12345';
  //   mountWithPinia({
  //     application: {
  //       programYearId: '12345',
  //       applicationMap: new Map([
  //         ['12345', { facilityList: [{ ccfriStatus: 'APPROVED' }], ccofProgramYearStatus: 'FUTURE' }],
  //       ]),
  //     },
  //     navBar: {
  //       navBarList: ['a'],
  //     },
  //   });
  //   cy.contains('button', 'Organization Closures').click();
  //   cy.get('@routerPush').should('have.been.calledWith', `${PATHS.ROOT.CLOSURES}/12345`);
  // });

  it('should render search box for facility filter', () => {
    mountWithPinia({
      navBar: {
        navBarList: ['a'],
      },
      application: {
        programYearId: '12345',
        applicationMap: new Map(),
      },
    });

    cy.contains('label', 'Filter by Facility Name').should('not.exist');
  });

  // TODO: Test the search box rendering
  // it.only('should render search box for facility filter', () => {
  //   mountWithPinia({
  //     navBar: {
  //       navBarList: ['a'],
  //     },
  //     application: {
  //       programYearId: '12345',
  //       applicationMap: new Map([[programYearId, { facilityList: [{ ccfriStatus: 'APPROVED' }] }]]),
  //     },
  //   });
  // });

  it('should render slider and display program year name sliced within slider', () => {
    const testName1 = '2022/2023 CCOF Program';
    const testName2 = '2023/2024 CCOF Program';
    const testName3 = '2024/2025 CCOF Program';
    mountWithPinia({
      navBar: {
        navBarList: ['a'],
      },
      application: {
        programYearId: '12345',
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

  // it.only('should render facility details ', () => {
  //   // const programYearId = '12345';
  //   // const facilityAccountNumber = 'FAC-45678';
  //   // const facilityName = 'CCOF Medical Center';
  //   // const licenseNumber = 'L1234567890';
  //   // const ccfriApplicationId = '111';

  //   mountWithPinia({
  //     navBar: {
  //       navBarList: ['a', 'b'],
  //     },
  //     application: {
  //       programYearId: '12345',
  //       applicationMap: new Map([
  //         [
  //           '12345',
  //           {
  //             applicationId: '1',
  //             ccofProgramYearName: `$aaa!!!`,
  //             ccofProgramYearStatus: 'FUTURE',
  //             facilityList: [
  //               {
  //                 facilityAccountNumber: 'zzz',
  //                 facilityName: 'fsdfdsf',
  //                 licenseNumber: 'fdsfdsfdf',
  //                 ccfriApplicationId: 'zzzzzfdf',
  //               },
  //             ],
  //           },
  //         ],
  //       ]),
  //     },
  //   });
  //   // cy.contains('p', `Facility ID: ${facilityAccountNumber}`);
  //   // cy.contains('p', `Facility Name: ${facilityName}`);
  //   // cy.contains('p', `Licence Number: ${licenseNumber}`);
  // });
});
