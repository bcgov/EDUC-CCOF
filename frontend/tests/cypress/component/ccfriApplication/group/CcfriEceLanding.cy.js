import CcfriEceLanding from '@/components/ccfriApplication/group/CcfriEceLanding.vue';
import vuetify from '@/plugins/vuetify';

function mountWithPinia(initialState = {}, overrides = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    cy.mount(CcfriEceLanding, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
        },
      },
      data() {
        return {
          ...overrides,
        };
      },
    });
    cy.wrap(pushStub).as('routerPush');
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
    const facilityAccountNumber = '9999';
    const facilityName = 'TEST_FAC';
    const licenseNumber = 'LIC-4444';
    mountWithPinia({
      navBar: {
        navBarList: [
          {
            facilityName,
            facilityId: '1234',
            licenseNumber,
            ccfriOptInStatus: '1',
            facilityAccountNumber,
          },
        ],
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
    const facilityAccountNumber = '9999';
    const facilityName = 'TEST_FAC';
    const licenseNumber = 'LIC-4444';
    mountWithPinia({
      navBar: {
        navBarList: [
          {
            facilityName,
            facilityId: '1234',
            licenseNumber,
            ccfriOptInStatus: '1',
            facilityAccountNumber,
          },
        ],
      },
    });

    cy.get('.v-col')
      .eq(1)
      .within(() => {
        cy.contains('button', 'UPDATE').should('not.have.css', 'pointer-events', 'none');
      });
  });

  it('should render `UPDATE` button as disabled', () => {
    const facilityAccountNumber = '9999';
    const facilityName = 'TEST_FAC';
    const licenseNumber = 'LIC-4444';
    mountWithPinia({
      application: {
        applicationStatus: 'SUBMITTED',
      },
      navBar: {
        navBarList: [
          {
            facilityName,
            facilityId: '1234',
            licenseNumber,
            ccfriOptInStatus: '1',
            facilityAccountNumber,
          },
        ],
      },
    });

    cy.get('.v-col')
      .eq(1)
      .within(() => {
        cy.contains('button', 'UPDATE').should('have.css', 'pointer-events', 'none');
      });
  });

  it('should render radio buttons', () => {
    const facilityAccountNumber = '9999';
    const facilityName = 'TEST_FAC';
    const licenseNumber = 'LIC-4444';
    mountWithPinia({
      navBar: {
        navBarList: [
          {
            facilityName,
            facilityId: '1234',
            licenseNumber,
            ccfriOptInStatus: '1',
            facilityAccountNumber,
          },
        ],
      },
    });

    cy.contains('button', 'UPDATE').click();
    cy.get('input[type="radio"]').should('have.length', 2);
    cy.get('.v-radio').eq(0).find('label').should('have.text', 'Opt-In');

    cy.get('.v-radio').eq(1).find('label').should('have.text', 'Opt-Out');
  });

  it('should render multiple facilities', () => {
    const fac1 = {
      facilityAccountNumber: '9999',
      facilityName: 'TEST_FAC',
      facilityId: '1234',
      licenseNumber: 'LIC-4444',
      ccfriOptInStatus: '1',
    };

    const fac2 = {
      facilityAccountNumber: '91911',
      facilityName: 'TEST_FAC2',
      facilityId: '4321',
      licenseNumber: 'LIC-3213',
      ccfriOptInStatus: '1',
    };
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
