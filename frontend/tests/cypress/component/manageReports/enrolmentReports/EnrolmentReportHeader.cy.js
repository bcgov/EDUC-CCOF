import EnrolmentReportHeader from '@/components/manageReports/enrolmentReports/EnrolmentReportHeader.vue';
import vuetify from '@/plugins/vuetify';

const programYearId = '1234';
const facilityId = '432423';

const enrolmentReport = {
  versionText: 'TEST-VERSION-TEXT',
  month: '11',
  year: '2025',
  programYearId,
  facilityId,
};

const facilityList = [
  {
    facilityId,
    facilityName: 'TEST-FAC-NAME',
    facilityAccountNumber: '99999',
    licenseNumber: 'LIC-1234',
  },
];

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(EnrolmentReportHeader, {
      global: {
        plugins: [pinia, vuetify],
      },
      props: {
        enrolmentReport,
      },
    });
  });
}

describe('<EnrolmentReportHeader />', () => {
  it('should render header content', () => {
    mountWithPinia({
      application: {
        applicationMap: new Map([[programYearId, { facilityList }]]),
      },
    });
    cy.contains('p', 'Enrolment Report');
    cy.contains(facilityList[0].facilityName);
    cy.contains(facilityList[0].facilityAccountNumber);
    cy.contains(`Licence #: ${facilityList[0].licenseNumber}`);
    cy.contains('Reporting month: November 2025');
    cy.contains(`Version number: ${enrolmentReport.versionText}`);
  });
});
