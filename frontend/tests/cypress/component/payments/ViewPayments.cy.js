import { StatusCodes } from 'http-status-codes';

import ViewPayments from '@/components/payments/ViewPayments.vue';
import vuetify from '@/plugins/vuetify';
import { buildQueryString } from '@/utils/common.js';
import { ApiRoutes } from '@/utils/constants';

const organizationId = '4321';
const programYearId = '1234';
const financialYear = 2027;

const facilityId = '4444';
const facilityList = [
  {
    facilityId,
    facilityName: 'TEST-FAC-NAME',
    facilityAccountNumber: '99999',
    licenseNumber: 'LIC-1234',
    facilityStatus: 'Active',
  },
];

const paymentWithInvoice = {
  paymentId: 'p1',
  facilityId,
  licenceNumber: 'LIC-1234',
  paymentMonth: 7,
  paymentYear: 2026,
  paymentAmount: 100,
  fundingTypeText: 'OFM Payment',
  reportTypeText: 'Base',
  paymentStatusCode: 'PAID',
  invoiceNumber: 'INV-001',
  approvedDate: '2026-08-01T00:00:00Z',
  paidDate: '2026-08-15T00:00:00Z',
};

const paymentWithNullInvoice = {
  ...paymentWithInvoice,
  paymentId: 'p2',
  paymentAmount: 50,
  invoiceNumber: null,
};

const paymentWithNullMonth = {
  ...paymentWithInvoice,
  paymentId: 'p3',
  paymentAmount: 75,
  paymentMonth: null,
  paymentYear: null,
  invoiceNumber: 'INV-003',
};

const zeroAmountPayment = {
  ...paymentWithInvoice,
  paymentId: 'p4',
  paymentAmount: 0,
  invoiceNumber: 'INV-000',
};

function interceptGetPaymentsAPI(payments = [paymentWithInvoice, paymentWithNullInvoice, paymentWithNullMonth, zeroAmountPayment]) {
  cy.intercept('GET', `${ApiRoutes.PAYMENTS}${buildQueryString({ organizationId, programYearId })}`, {
    statusCode: StatusCodes.OK,
    body: payments,
  }).as('getPaymentsAPI');
}

function mountWithPinia() {
  cy.setupPinia({
    initialState: {
      app: {
        lookupInfo: {
          programYear: {
            list: [{ programYearId, financialYear }],
          },
        },
      },
      application: {
        programYearId,
        applicationMap: new Map([
          [
            programYearId,
            {
              ccofProgramYearId: programYearId,
              ccofProgramYearStatus: 'CURRENT',
              ccofProgramYearName: '2026-2027',
              facilityList,
            },
          ],
        ]),
      },
      organization: {
        organizationId,
      },
    },
  }).then((pinia) => {
    cy.mount(ViewPayments, {
      global: {
        plugins: [pinia, vuetify],
      },
    });
  });
}

describe('<ViewPayments />', () => {
  it('should render payments including rows with null invoice numbers', () => {
    interceptGetPaymentsAPI();
    mountWithPinia();
    cy.wait('@getPaymentsAPI');

    cy.get('.v-data-table tbody tr').should('have.length', 3);
    cy.contains('td', 'INV-001');
    cy.contains('td', 'INV-003');
    cy.contains('td', '$50.00');
  });

  it('should hide a null-invoice row when the invoice search does not match it', () => {
    interceptGetPaymentsAPI();
    mountWithPinia();
    cy.wait('@getPaymentsAPI');

    cy.contains('.v-text-field', 'Invoice number').find('input').type('INV-001');

    cy.contains('td', 'INV-001');
    cy.contains('td', '$50.00').should('not.exist');
  });

  it('should render rows with null month/year even when a month filter is active', () => {
    interceptGetPaymentsAPI();
    mountWithPinia();
    cy.wait('@getPaymentsAPI');

    cy.contains('td', '$75.00').should('exist');
  });

  it('should keep null month/year rows when no months are selected', () => {
    interceptGetPaymentsAPI();
    mountWithPinia();
    cy.wait('@getPaymentsAPI');

    cy.get('.v-select').first().click();
    cy.contains('.v-list-item', 'Select All').click();
    cy.get('.v-select').first().click();

    cy.get('.v-data-table tbody tr').should('have.length', 1);
    cy.contains('td', '$75.00');
  });

  it('should exclude zero-amount payments', () => {
    interceptGetPaymentsAPI();
    mountWithPinia();
    cy.wait('@getPaymentsAPI');

    cy.contains('td', '$0.00').should('not.exist');
    cy.contains('td', 'INV-000').should('not.exist');
  });

  it('should handle 5,000 payment rows: paginate, change page size, sort at volume', () => {
    const TOTAL = 5000;
    const rows = Array.from({ length: TOTAL }, (_, i) => ({
      ...paymentWithInvoice,
      paymentId: `p${i}`,
      paymentAmount: i + 1,
      invoiceNumber: `INV-${String(i).padStart(5, '0')}`, // INV-00000 … INV-04999
    }));
    interceptGetPaymentsAPI(rows);
    mountWithPinia();
    cy.wait('@getPaymentsAPI');
    // default 500px viewport renders the table in mobile mode (no th headers) — force desktop layout
    cy.viewport(1280, 720);

    // all 5,000 items reached the table (footer total), DOM renders only the current page
    cy.contains('of 5000');
    cy.get('.v-data-table tbody tr').should('have.length', 20);

    // page-size selector → 100: 100 rows rendered, total unchanged
    cy.get('.v-data-table-footer .v-select').click();
    cy.contains('.v-list-item', '100').click();
    cy.get('.v-data-table tbody tr').should('have.length', 100);
    cy.contains('of 5000');

    // sort desc by Invoice Number → row #5000 (INV-04999) must exist client-side
    // (re-query between clicks: the header cell re-renders after each sort toggle)
    cy.contains('th', 'Invoice Number').click();
    cy.contains('th', 'Invoice Number').click();
    cy.get('.v-data-table tbody tr').first().should('contain', 'INV-04999');
  });
});
