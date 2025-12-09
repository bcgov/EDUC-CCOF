import LicenceHistory from '@/components/licences/LicenceHistory.vue';
import vuetify from '@/plugins/vuetify';
import { LICENCE_STATUSES } from '@/utils/constants.js';

const LICENCES = [
  {
    licenceStatus: LICENCE_STATUSES.ACTIVE,
    licenceNumber: '44',
    licenceStartDate: '2025-01-01',
    recordStartDate: '2025-12-01',
    recordEndDate: '2025-12-05',
  },
];

function mountWithPinia({ initialState = {}, propOverride = {} } = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub().as('routerPush');
    const onViewServiceDetails = cy.spy().as('viewServiceDetailsSpy');
    cy.mount(LicenceHistory, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
        },
      },
      attrs: {
        'onView-service-details': onViewServiceDetails,
      },
      props: {
        ...propOverride,
      },
    });
  });
}

describe('<LicenceHistory />', () => {
  beforeEach(() => {
    mountWithPinia({ propOverride: { licences: LICENCES } });
  });
  it('should render table headers', () => {
    cy.get('th').should('have.length', 6);
    cy.contains('th', 'Status');
    cy.contains('th', 'Licence Number');
    cy.contains('th', 'Licence Effective Date');
    cy.contains('th', 'Record Start Date');
    cy.contains('th', 'Record End Date');
    cy.contains('th', 'Action');
  });

  it('should render licences in the table', () => {
    const licence = LICENCES[0];
    cy.contains(licence.licenceStatus);
    cy.contains(licence.licenceNumber);
    cy.contains(licence.licenceStartDate);
    cy.contains(licence.recordStartDate);
    cy.contains(licence.recordEndDate);
  });

  it('should render `View Record` button', () => {
    const licence = LICENCES[0];
    cy.contains('button', 'View Record').click();
    cy.get('@viewServiceDetailsSpy').should('have.been.calledWith', ('view-service-details', licence));
  });
});
