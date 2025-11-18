import EnrolmentReportDeclaration from '@/components/manageReports/enrolmentReports/EnrolmentReportDeclaration.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes, PATHS } from '@/utils/constants.js';
import { PERMISSIONS } from '@/utils/constants/permissions';

const programYearId = '1234';
const enrolmentReportId = '4313';
const facilityId = '432423';

const enrolmentReport = {
  versionText: 'TEST-VERSION-TEXT',
  month: '11',
  year: '2025',
  programYearId,
  facilityId,
};

function interceptAPI() {
  cy.intercept('GET', `${ApiRoutes.ENROLMENT_REPORTS}/${enrolmentReportId}`, {
    statusCode: 200,
    body: enrolmentReport,
  });
}

function mountWithPinia(initialState = {}, dataOverride = {}) {
  const routeParams = { enrolmentReportId };
  const pushStub = cy.stub().as('routerPush');
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(EnrolmentReportDeclaration, {
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
      data() {
        return {
          ...dataOverride,
        };
      },
    });
  });
}

describe('<EnrolmentReportDeclaration />', () => {
  beforeEach(() => {
    interceptAPI();
  });

  it.only('should render enrolment report header', () => {
    const facilityName = 'TEST-FAC-NAME';
    const facilityAccountNumber = '99999';
    const licenseNumber = 'LIC-1234';
    mountWithPinia({
      application: {
        applicationMap: new Map([
          [programYearId, { facilityList: [{ facilityId, facilityName, facilityAccountNumber, licenseNumber }] }],
        ]),
      },
    });
    cy.contains(facilityName);
    cy.contains(facilityAccountNumber);
    cy.contains(`Licence #: ${licenseNumber}`);
    cy.contains('Reporting month: November 2025');
    cy.contains(`Version number: ${enrolmentReport.versionText}`);
  });

  it('should render decleration text', () => {
    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, {}]]),
      },
    });

    cy.contains('p', 'By submitting this Enrolment Report, I confirm that:');
    cy.contains('li', 'The information provided in this report is true, accurate and complete');
    cy.contains('li', 'I understand that the Ministry will be relying on the content of these reports');
    cy.contains('li', 'These facilities have not accepted registered or drop-in children');

    cy.get('ul').within(() => {
      cy.get('li').should('have.length', 7);
    });
  });

  it('should not render submit button without proper permissions', () => {
    const permWithoutSubmitER = Object.values(PERMISSIONS).filter(
      (permission) => permission !== PERMISSIONS.SUBMIT_ENROLMENT_REPORT,
    );
    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, {}]]),
      },
      auth: {
        permissions: permWithoutSubmitER,
      },
    });
    cy.contains('button', 'Accept and Submit').should('not.exist');
  });

  it('should render submit button', () => {
    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, {}]]),
      },
      auth: {
        permissions: [PERMISSIONS.SUBMIT_ENROLMENT_REPORT],
      },
    });
    cy.contains('button', 'Accept and Submit').should('have.css', 'pointer-events', 'none');
  });

  it('should render `Back` button', () => {
    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, {}]]),
      },
    });

    cy.contains('button', 'Back').click();
    cy.get('@routerPush').should('have.been.calledWith', `${PATHS.ROOT.ENROLMENT_REPORTS}/${enrolmentReportId}`);
  });
});
