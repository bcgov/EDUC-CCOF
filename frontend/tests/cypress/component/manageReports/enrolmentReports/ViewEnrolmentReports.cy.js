import ViewEnrolmentReports from '@/components/manageReports/enrolmentReports/ViewEnrolmentReports.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes, ENROLMENT_REPORT_STATUSES, PATHS } from '@/utils/constants.js';
import { PERMISSIONS } from '@/utils/constants/permissions';

const organizationName = 'ORG-TEST-NAME';
const organizationAccountNumber = 'ORG-1234';

const programYearId = '1234';
const facilityId = '4444';
const organizationId = '4321';
const facilityList = [
  {
    facilityId,
    facilityName: 'TEST-FAC-NAME',
    facilityAccountNumber: '99999',
    licenseNumber: 'LIC-1234',
  },
];

const enrolmentReportDraft = {
  versionText: 'TEST-VERSION-TEXT',
  month: '11',
  year: '2025',
  submissionDeadline: '2026-01-01',
  externalCcofStatusText: 'DRAFT',
  externalCcofStatusCode: ENROLMENT_REPORT_STATUSES.DRAFT,
  externalCcfriStatusText: 'DRAFT',
  externalCcfriStatusCode: ENROLMENT_REPORT_STATUSES.DRAFT,
  enrolmentReportId: '111223',
  programYearId,
  facilityId,
};

const enrolmentReportApproved = {
  month: '11',
  year: '2025',
  submissionDeadline: '2026-01-01',
  externalCcofStatusText: 'APPROVED',
  externalCcofStatusCode: ENROLMENT_REPORT_STATUSES.APPROVED,
  externalCcfriStatusText: 'APPROVED',
  externalCcfriStatusCode: ENROLMENT_REPORT_STATUSES.APPROVED,
  enrolmentReportId: '425422',
  programYearId,
  facilityId,
};

const createApplicationStore = (extras = {}) => {
  return {
    application: {
      applicationMap: new Map([[programYearId, { facilityList, ccofProgramYearName: '2025-2026' }]]),
      ...extras,
    },
  };
};

const createOrganizationStore = (extras = {}) => {
  return {
    organization: {
      organizationName,
      organizationAccountNumber,
      organizationId,
      ...extras,
    },
  };
};

function interceptAPI(enrolReport) {
  enrolReport = enrolReport ?? enrolmentReportDraft;
  cy.intercept(
    'GET',
    `${ApiRoutes.ENROLMENT_REPORTS}?organizationId=${organizationId}&programYearId=${programYearId}`,
    {
      statusCode: 200,
      body: [enrolReport],
    },
  ).as('getEnrolments');
}

function mountWithPinia({ initialState = {} } = {}) {
  const pushStub = cy.stub().as('routerPush');
  const backStub = cy.stub().as('routerBack');

  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(ViewEnrolmentReports, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
            back: backStub,
          },
        },
      },
      data() {
        return {
          selectedProgramYear: { programYearId },
        };
      },
    });
  });
}

describe('<ViewEnrolmentReports />', () => {
  it('should render default component content', () => {
    interceptAPI();
    mountWithPinia({
      initialState: {
        ...createApplicationStore(),
        ...createOrganizationStore(),
      },
    });

    cy.contains('p', 'Enrolment Report');
    cy.contains(organizationName);
    cy.contains(organizationAccountNumber);
    cy.contains('p', 'Select fiscal year:');
    cy.contains('View, create and update monthly enrolment reports for your facility(ies).');
  });

  it('should render reporting month, facility, sort, page inputs', () => {
    interceptAPI();
    mountWithPinia({
      initialState: {
        ...createApplicationStore(),
        ...createOrganizationStore(),
      },
    });

    cy.contains('Select reporting month:');
    cy.contains('Select facility:');
    cy.contains('Sort by');
    cy.contains('Items per page');
    cy.get('.v-select').should('have.length', 4);
  });

  it('should render enrolment report info', () => {
    interceptAPI(enrolmentReportDraft);

    mountWithPinia({
      initialState: {
        ...createApplicationStore(),
        ...createOrganizationStore(),
      },
    });
    cy.wait('@getEnrolments');

    cy.get('table').within(() => {
      cy.get('td').eq(0).should('contain.text', 'Version Number').and('contain.text', enrolmentReportDraft.versionText);
      cy.get('td').eq(1).should('contain.text', facilityList[0].facilityAccountNumber);
      cy.get('td').eq(2).should('contain.text', 'Facility Name').and('contain.text', facilityList[0].facilityName);
      cy.get('td').eq(3).should('contain.text', 'Licence Number').and('contain.text', facilityList[0].licenseNumber);
      cy.get('td').eq(4).should('contain.text', 'Reporting Month').and('contain.text', 'November 2025');
      cy.get('td')
        .eq(5)
        .should('contain.text', 'Submission Deadline')
        .and('contain.text', enrolmentReportDraft.submissionDeadline);
      cy.get('td').eq(6).should('contain.text', 'CCOF Base Funding Status').and('contain.text', 'DRAFT');
      cy.get('td').eq(7).should('contain.text', 'CCFRI Funding Status').and('contain.text', 'DRAFT');
    });
  });

  it('should render `View` button', () => {
    interceptAPI(enrolmentReportApproved);

    mountWithPinia({
      initialState: {
        ...createApplicationStore(),
        ...createOrganizationStore(),
      },
    });
    cy.contains('button', 'View').click();
    cy.get('@routerPush').should(
      'have.been.calledWith',
      `${PATHS.ROOT.ENROLMENT_REPORTS}/${enrolmentReportApproved.enrolmentReportId}`,
    );
  });

  it('should render `Edit` button', () => {
    interceptAPI(enrolmentReportDraft);

    mountWithPinia({
      initialState: {
        ...createApplicationStore(),
        ...createOrganizationStore(),
        auth: {
          permissions: [PERMISSIONS.EDIT_DRAFT_ER],
        },
      },
    });
    cy.contains('button', 'Edit').click();
    cy.get('@routerPush').should(
      'have.been.calledWith',
      `${PATHS.ROOT.ENROLMENT_REPORTS}/${enrolmentReportDraft.enrolmentReportId}`,
    );
  });

  it('should not render `Edit` button without edit draft ER permissions', () => {
    const permWithoutEditDraftER = Object.values(PERMISSIONS).filter(
      (permission) => permission !== PERMISSIONS.EDIT_DRAFT_ER,
    );

    interceptAPI(enrolmentReportDraft);

    mountWithPinia({
      initialState: {
        ...createApplicationStore(),
        ...createOrganizationStore(),
        auth: {
          permissions: permWithoutEditDraftER,
        },
      },
    });
    cy.contains('button', 'Edit').should('not.exist');
  });

  it('should render `Adjust` button', () => {
    interceptAPI(enrolmentReportApproved);

    mountWithPinia({
      initialState: {
        ...createApplicationStore(),
        ...createOrganizationStore(),
        auth: {
          permissions: [PERMISSIONS.ADJUST_EXISTING_ER],
        },
      },
    });
    cy.contains('button', 'Adjust');
  });

  it('should not render `Adjust` button without permissions', () => {
    const permWithoutAdjustExistER = Object.values(PERMISSIONS).filter(
      (permission) => permission !== PERMISSIONS.ADJUST_EXISTING_ER,
    );
    interceptAPI(enrolmentReportApproved);

    mountWithPinia({
      initialState: {
        ...createApplicationStore(),
        ...createOrganizationStore(),
        auth: {
          permissions: permWithoutAdjustExistER,
        },
      },
    });
    cy.wait('@getEnrolments');
    cy.contains('button', 'Adjust').should('not.exist');
  });

  it('should call router back when back button is clicked', () => {
    interceptAPI(enrolmentReportApproved);
    mountWithPinia({
      initialState: {
        ...createApplicationStore(),
        ...createOrganizationStore(),
      },
    });

    cy.contains('button', 'Back').click();
    cy.get('@routerBack').should('have.been.called');
  });
});
