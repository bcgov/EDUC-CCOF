import EnrolmentReportForm from '@/components/manageReports/enrolmentReports/EnrolmentReportForm.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes, ENROLMENT_REPORT_STATUSES, ORGANIZATION_PROVIDER_TYPES_IDS, PATHS } from '@/utils/constants.js';
import { PERMISSIONS } from '@/utils/constants/permissions';

const facilityId = '3211';
const programYearId = '1234';
const enrolmentReportId = '4313';
const prevEnrolmentReportId = '4314';

const facilityList = [
  {
    facilityId,
    facilityName: 'TEST-FAC-NAME',
    facilityAccountNumber: '99999',
    licenseNumber: 'LIC-1234',
  },
];

const enrolmentReport = {
  versionText: 'TEST-VERSION-TEXT',
  month: '11',
  year: '2025',
  programYearId,
  facilityId,
  baseFundingRates: {},
  ccfriProviderPaymentRates: {},
  ccfriProviderPaymentRates: {},
};

const enrolmentReportGroup = {
  versionText: 'TEST-VERSION-TEXT',
  month: '11',
  year: '2025',
  programYearId,
  facilityId,
  baseFundingRates: {},
  organizationProviderType: ORGANIZATION_PROVIDER_TYPES_IDS.GROUP,
  ccfriProviderPaymentRates: {},
  ccfriProviderPaymentRates: {},
};

const enrolmentReportAdjustment = {
  versionText: 'TEST-VERSION-TEXT',
  month: '11',
  year: '2025',
  isAdjustment: true,
  prevEnrolmentReportId,
  programYearId,
  facilityId,
  baseFundingRates: {},
  ccfriProviderPaymentRates: {},
  ccfriProviderPaymentRates: {},
};

const enrolmentReportPrev = {
  versionText: 'TEST-VERSION-TEXT',
  month: '11',
  year: '2025',
  isAdjustment: true,
  enrolmentReportId: prevEnrolmentReportId,
  programYearId,
  facilityId,
  baseFundingRates: {},
  ccfriProviderPaymentRates: {},
  ccfriProviderPaymentRates: {},
  currentTotalLess0To18: '22',
  currentTotalOver0To18: '33',
  currentTotalLess18To36: '44',
  currentTotalOver18To36: '45',
  currentTotalLess3YK: '49',
  currentTotalOver3YK: '32',
  currentTotalLessOOSCK: '99',
  currentTotalOverOOSCK: '55',
  currentTotalLessOOSCG: '94',
  currentTotalOverOOSCG: '321',
};

const dailyReport = {
  versionText: 'TEST-VERSION-TEXT',
  month: '11',
  year: '2025',
  programYearId,
  facilityId,
  less0To18: '44',
};

const dailyReportPrev = {
  versionText: 'TEST-VERSION-TEXT',
  month: '10',
  year: '2025',
  programYearId,
  facilityId,
  less0To18: '12',
};

function interceptAPI(enrolReport = enrolmentReport) {
  cy.intercept('GET', `${ApiRoutes.ENROLMENT_REPORTS}/${enrolmentReportId}`, {
    statusCode: 200,
    body: enrolReport,
  }).as('getEnrolmentReport');

  cy.intercept('GET', `${ApiRoutes.ENROLMENT_REPORTS}/${enrolmentReportId}/daily-enrolments`, {
    statusCode: 200,
    body: [dailyReport],
  }).as('getDailyReport');
}

function interceptAPIPrevEnrol() {
  cy.intercept('GET', `${ApiRoutes.ENROLMENT_REPORTS}/${prevEnrolmentReportId}`, {
    statusCode: 200,
    body: enrolmentReportPrev,
  }).as('getPrevEnrolmentReport');

  cy.intercept('GET', `${ApiRoutes.ENROLMENT_REPORTS}/${prevEnrolmentReportId}/daily-enrolments`, {
    statusCode: 200,
    body: [dailyReportPrev],
  }).as('getPrevDailyReport');
}

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    const routeParams = { enrolmentReportId };
    cy.mount(EnrolmentReportForm, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $route: {
            params: routeParams,
          },
          $router: {
            push: pushStub,
          },
        },
      },
    });
    cy.wrap(pushStub).as('routerPush');
  });
}

describe('<EnrolmentReportForm />', () => {
  it('should render switch input for full month or no enrolment', () => {
    interceptAPI();

    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, { facilityList }]]),
      },
    });

    cy.contains('span', 'Report full month closure or no enrolment');
    cy.get('.v-selection-control').should('exist');
  });

  it('should render table header without `Preschool`', () => {
    interceptAPI();

    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, { facilityList }]]),
      },
    });

    cy.contains('.v-col', '0 - 18 Months')
      .parent('.v-row')
      .within(() => {
        cy.get('.v-col').should('have.length', 6);
        cy.contains('.v-col', '0 - 18 Months');
        cy.contains('.v-col', '18 - 36 Months');
        cy.contains('.v-col', '3 Years to Kinder');
        cy.contains('.v-col', 'Kinder Before & After');
        cy.contains('.v-col', 'Grade 1 - 12 Years');
        cy.contains('.v-col', 'Preschool').should('not.exist');
      });
  });

  it('should render table header with `Preschool`', () => {
    interceptAPI(enrolmentReportGroup);

    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, { facilityList }]]),
      },
    });

    cy.contains('.v-col', '0 - 18 Months')
      .parent('.v-row')
      .within(() => {
        cy.get('.v-col').should('have.length', 7);
        cy.contains('.v-col', 'Preschool').should('exist');
      });
  });

  it('should render link to request a change for frees', () => {
    interceptAPI(enrolmentReportGroup);

    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, { facilityList }]]),
      },
    });
    cy.wait('@getEnrolmentReport');
    cy.wait('@getDailyReport');
    cy.contains(
      'Approved Parent Fees are the fees approved by the program. If any of these fees are incorrect, click here to request a change.',
    );
  });

  it('should render `Approved Parent Fees`', () => {
    interceptAPI();

    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, { facilityList }]]),
      },
    });
    cy.wait('@getEnrolmentReport');
    cy.wait('@getDailyReport');
    cy.contains('Approved Parent Fees $')
      .parent('.v-row')
      .within(() => {
        cy.get('.v-col').should('have.length', 6);
      });
  });

  it('should render `Approved Parent Fees` with preschool fee column', () => {
    interceptAPI(enrolmentReportGroup);

    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, { facilityList }]]),
      },
    });
    cy.wait('@getEnrolmentReport');
    cy.wait('@getDailyReport');
    cy.contains('Approved Parent Fees $')
      .parent('.v-row')
      .within(() => {
        cy.get('.v-col').should('have.length', 7);
      });
  });

  it('should render `Frequency` inputs', () => {
    interceptAPI();

    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, { facilityList }]]),
      },
    });
    cy.wait('@getEnrolmentReport');
    cy.wait('@getDailyReport');
    cy.contains('Frequency')
      .parent('.v-row')
      .within(() => {
        cy.get('.v-col').should('have.length', 6);
      });
  });

  it('should render `Current Total` card', () => {
    const curTotalValues = {
      currentTotalLess0To18: 1,
      currentTotalOver0To18: 2,
      currentTotalLess18To36: 3,
      currentTotalOver18To36: 4,
      currentTotalLess3YK: 5,
      currentTotalOver3YK: 6,
      currentTotalLessOOSCK: 7,
      currentTotalOverOOSCK: 8,
      currentTotalLessOOSCG: 9,
      currentTotalOverOOSCG: 10,
    };

    const enrolmentReportCurTotal = { ...enrolmentReport, ...curTotalValues };
    interceptAPI(enrolmentReportCurTotal);
    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, { facilityList }]]),
      },
    });

    cy.contains('Current Total')
      .parent('.v-row')
      .within(() => {
        Object.values(curTotalValues).forEach((value) => {
          cy.contains(value);
        });
      });
  });

  it('should render `Prev Approved` card', () => {
    interceptAPI(enrolmentReportAdjustment);
    interceptAPIPrevEnrol();
    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, { facilityList }]]),
      },
    });

    cy.contains('Prev Approved')
      .parent('.v-row')
      .within(() => {
        cy.contains(enrolmentReportPrev.currentTotalLess0To18);
        cy.contains(enrolmentReportPrev.currentTotalOver0To18);
        cy.contains(enrolmentReportPrev.currentTotalLess18To36);
        cy.contains(enrolmentReportPrev.currentTotalOver18To36);
        cy.contains(enrolmentReportPrev.currentTotalOver3YK);
        cy.contains(enrolmentReportPrev.currentTotalLessOOSCK);
        cy.contains(enrolmentReportPrev.currentTotalOverOOSCK);
        cy.contains(enrolmentReportPrev.currentTotalLessOOSCG);
        cy.contains(enrolmentReportPrev.currentTotalOverOOSCG);
      });
  });

  it('should render component content specific to an adjustment', () => {
    interceptAPI(enrolmentReportAdjustment);
    interceptAPIPrevEnrol();
    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, { facilityList }]]),
      },
    });
    cy.contains('Prev Approved');
    cy.contains('Prev CCOF Base $');
    cy.contains('Prev CCFRI $');
    cy.contains('Prev CCFRI Provider $');
    cy.contains('Difference CCFRI Provider $');
    cy.contains('Prev Paid $');
  });

  it('should not render component content specific to an adjustment if not an adjustment report', () => {
    interceptAPI(enrolmentReport);
    interceptAPIPrevEnrol();
    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, { facilityList }]]),
      },
    });

    cy.contains('Prev Approved').should('not.exist');
    cy.contains('Prev CCOF Base $').should('not.exist');
    cy.contains('Prev CCFRI $').should('not.exist');
    cy.contains('Prev CCFRI Provider $').should('not.exist');
    cy.contains('Difference CCFRI Provider $').should('not.exist');
    cy.contains('Prev Paid $').should('not.exist');
  });

  it('should render grand totals text', () => {
    interceptAPI(enrolmentReportAdjustment);
    interceptAPIPrevEnrol();
    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, { facilityList }]]),
      },
    });
    cy.contains('Grand Totals');
    cy.contains('CCFRI Provider Payment');
    cy.contains('CCFRI Payment');
    cy.contains('CCOF Base');

    cy.contains('Current $');
    cy.contains('Prev Paid $');
    cy.contains('Difference $');
  });

  it('should render legend', () => {
    interceptAPI(enrolmentReport);
    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, { facilityList }]]),
      },
    });
    cy.get('.legend').within(() => {
      cy.get('div').should('have.length', 2);
      cy.contains('Stat holidays');
      cy.contains('Weekends');
    });
  });

  it('should render `Back` button', () => {
    interceptAPI(enrolmentReport);
    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, { facilityList }]]),
      },
    });
    cy.contains('button', 'Back').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.ENROLMENT_REPORTS);
  });

  it('should render `Save` button', () => {
    const draftER = {
      ...enrolmentReport,
      externalCcofStatusCode: ENROLMENT_REPORT_STATUSES.DRAFT,
    };
    interceptAPI(draftER);
    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, { facilityList }]]),
      },
      auth: {
        permissions: [PERMISSIONS.EDIT_DRAFT_ER, PERMISSIONS.ADJUST_EXISTING_ER],
      },
    });
  });
});
