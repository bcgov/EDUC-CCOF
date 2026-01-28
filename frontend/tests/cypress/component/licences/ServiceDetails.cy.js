import ServiceDetails from '@/components/licences/ServiceDetails.vue';
import vuetify from '@/plugins/vuetify';
import { LICENCE_STATUSES } from '@/utils/constants.js';

const SERVICE_DELIVERY_DETAIL = {
  licenceCategory: 'preschool',
  maxCapacity: 12,
  preschoolSessions: 22,
  beforeSchoolCare: 1,
  afterSchoolCare: 1,
  morningKinderCare: 1,
  afterKinderCare: 1,
};

const LICENCE = {
  licenceNumber: 'LIC-1234',
  licenceStatus: LICENCE_STATUSES.ACTIVE,
  licenceStartDate: '2025-01-01',
  recordStartDate: '2025-12-01',
  recordEndDate: '2025-12-05',
  serviceDeliveryDetails: [SERVICE_DELIVERY_DETAIL],
  licenceMaxCapacity: 10,
  licenceMaxDaysPerWeek: 13,
  licenceMaxWeeksPerYear: 14,
};

function mountWithPinia({ initialState = {}, propOverride = {} } = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(ServiceDetails, {
      global: {
        plugins: [pinia, vuetify],
      },
      props: {
        ...propOverride,
      },
    });
  });
}

describe('<ServiceDetails />', () => {
  beforeEach(() => {
    cy.viewport(1080, 1080);
  });

  it('should render licence information', () => {
    mountWithPinia({ propOverride: { licence: LICENCE } });

    cy.contains('Licence Number:').siblings('span').should('include.text', LICENCE.licenceNumber);
    cy.contains('Licence Effective Date:').siblings('span').should('have.text', LICENCE.licenceStartDate);
    cy.contains('Record Start Date:').siblings('span').should('have.text', LICENCE.recordStartDate);
    cy.contains('Record End Date:').siblings('span').should('have.text', LICENCE.recordEndDate);
  });

  it('should render general service delivery details', () => {
    mountWithPinia({ propOverride: { licence: LICENCE } });

    cy.contains('Maximum Capacity:').siblings('span').should('include.text', LICENCE.licenceMaxCapacity);
    cy.contains('Licence Category:').siblings('span').should('include.text', SERVICE_DELIVERY_DETAIL.licenceCategory);

    cy.contains('Maximum Capacity by Care Type:')
      .siblings('span')
      .should('include.text', SERVICE_DELIVERY_DETAIL.maxCapacity);

    cy.contains('Max number of days per week you provide child care:')
      .siblings('span')
      .should('include.text', LICENCE.licenceMaxDaysPerWeek);

    cy.contains('Max number of weeks per year you provide child care:')
      .siblings('span')
      .should('include.text', LICENCE.licenceMaxWeeksPerYear);
  });

  it('should render preschool specific sessions', () => {
    mountWithPinia({ propOverride: { licence: LICENCE } });

    cy.contains('Number of preschool sessions per week:')
      .siblings('span')
      .should('include.text', SERVICE_DELIVERY_DETAIL.preschoolSessions);
  });

  it('should not render preschool sessions if not a preschool category', () => {
    const licenceOverride = {
      ...LICENCE,
      serviceDeliveryDetails: [{ ...SERVICE_DELIVERY_DETAIL, licenceCategory: '' }],
    };
    mountWithPinia({ propOverride: { licence: licenceOverride } });
    cy.contains('Number of preschool sessions per week:').should('not.exist');
  });

  it('should render school age details', () => {
    const licenceOverride = {
      ...LICENCE,
      serviceDeliveryDetails: [{ ...SERVICE_DELIVERY_DETAIL, licenceCategory: 'school age care on school grounds' }],
    };
    mountWithPinia({ propOverride: { licence: licenceOverride } });

    cy.contains('Before school care offered:').siblings('span').should('include.text', 'Yes');
    cy.contains('After school care offered:').siblings('span').should('include.text', 'Yes');
    cy.contains('Before Kindergarten care offered:').siblings('span').should('include.text', 'Yes');
    cy.contains('After Kindergarten care offered:').siblings('span').should('include.text', 'Yes');
  });

  it('should render extended hours information if licenceExtendedHours is true', () => {
    const licenceOverride = { ...LICENCE, licenceExtendedHours: true };
    mountWithPinia({ propOverride: { licence: licenceOverride } });

    cy.contains('Extended Hours - Maximum number of days per week:').should('exist');
    cy.contains('Extended Hours - Maximum number of weeks per year:').should('exist');

    cy.get('thead').within(() => {
      cy.get('th').should('have.length', 3);
      cy.contains('th', 'Licence Category (Extended Hours)').should('exist');
      cy.contains('th', 'Maximum spaces offered (4 hours or less)').should('exist');
      cy.contains('th', 'Maximum spaces offered (over 4 hours)').should('exist');
    });
  });

  it('should not render extended hours information if licenceExtendedHours is false', () => {
    const licenceOverride = { ...LICENCE, licenceExtendedHours: false };
    mountWithPinia({ propOverride: { licence: licenceOverride } });

    cy.contains('Extended Hours - Maximum number of days per week:').should('not.exist');
  });
});
