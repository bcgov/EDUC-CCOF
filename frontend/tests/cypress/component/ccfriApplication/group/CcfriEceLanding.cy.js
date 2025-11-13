import CcfriEceLanding from '@/components/ccfriApplication/group/CcfriEceLanding.vue';
import vuetify from '@/plugins/vuetify';

const facilityAccountNumber = '9999';
const facilityName = 'TEST_FAC';
const licenseNumber = 'LIC-4444';

const fac1 = {
  ccfriOptInStatus: '1',
  facilityAccountNumber,
  facilityId: '1234',
  facilityName,
  licenseNumber,
};

const fac2 = {
  ccfriOptInStatus: '1',
  facilityAccountNumber: '91911',
  facilityId: '4321',
  facilityName: 'TEST_FAC2',
  licenseNumber: 'LIC-3213',
};

function mountWithPinia(initialState = {}, overrides = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(CcfriEceLanding, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {},
      },
      data() {
        return {
          ...overrides,
        };
      },
    });
  });
}

describe('<CcfriEceLanding />', () => {
  beforeEach(() => {
    cy.viewport(1020, 1000);
  });
  it('should render general component content', () => {
    const programYearLabel = 'TEST 2025/2026TEST';
    mountWithPinia({
      application: {
        programYearLabel,
      },
    });
    cy.contains('div', 'Child Care Operating Funding Program - 2025-2026 Program Confirmation Form');
    cy.contains('Child Care Fee Reduction Initiative (CCFRI)');
    cy.contains('Confirm CCFRI participation for each facility.');
  });

  it('should render `Opt-In All Facilities` button as disabled', () => {
    mountWithPinia({
      application: {
        applicationStatus: 'SUBMITTED',
      },
    });
    cy.contains('button', 'Opt-In All Facilities').should('have.css', 'pointer-events', 'none');
  });

  it('should render `Opt-In All Facilities` button as enabled', () => {
    mountWithPinia();
    cy.contains('button', 'Opt-In All Facilities').should('not.have.css', 'pointer-events', 'none');
  });

  it('should render one facility', () => {
    mountWithPinia({
      navBar: {
        navBarList: [fac1],
      },
    });

    cy.get('.v-col')
      .eq(0)
      .within(() => {
        cy.contains('p', `Facility ID: ${facilityAccountNumber}`);
        cy.contains('p', `Facility Name: ${facilityName}`);
        cy.contains('p', `Licence Number: ${licenseNumber}`);
        cy.contains('p', `Opt-In: IN`);
      });
  });

  it('should render `UPDATE` button', () => {
    mountWithPinia({
      navBar: {
        navBarList: [fac1],
      },
    });

    cy.get('.v-col')
      .eq(1)
      .within(() => {
        cy.contains('button', 'UPDATE').should('not.have.css', 'pointer-events', 'none');
      });
  });

  it('should render `UPDATE` button as disabled', () => {
    mountWithPinia({
      application: {
        applicationStatus: 'SUBMITTED',
      },
      navBar: {
        navBarList: [fac1],
      },
    });

    cy.get('.v-col')
      .eq(1)
      .within(() => {
        cy.contains('button', 'UPDATE').should('have.css', 'pointer-events', 'none');
      });
  });

  it('should render radio buttons', () => {
    mountWithPinia({
      navBar: {
        navBarList: [fac1],
      },
    });

    cy.contains('button', 'UPDATE').click();
    cy.get('input[type="radio"]').should('have.length', 2);
    cy.get('.v-radio').eq(0).find('label').should('have.text', 'Opt-In');

    cy.get('.v-radio').eq(1).find('label').should('have.text', 'Opt-Out');
  });

  it('should render multiple facilities', () => {
    mountWithPinia({
      navBar: {
        navBarList: [fac1, fac2],
      },
    });

    cy.get('.v-card').should('have.length', 2);
  });

  it('should render navigation buttons', () => {
    mountWithPinia();
    cy.contains('button', 'Back');
    cy.contains('button', 'Next');
    cy.contains('button', 'Save');
  });
});
