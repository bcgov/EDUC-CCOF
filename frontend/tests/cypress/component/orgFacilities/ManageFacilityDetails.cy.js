import ManageFacilityDetails from '@/components/orgFacilities/ManageFacilityDetails.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes } from '@/utils/constants';
import { PERMISSIONS } from '@/utils/constants/permissions';
import { capitalize } from '@/utils/format';

const facility1 = {
  facilityId: 1,
  facilityName: 'Test Med Clinic',
  facilityAccountNumber: 'FAC-104839',
  licenseNumber: 'LIC-BC-00000',
  facilityAddress: '123 Test Street',
  phone: '250-999-9999',
  email: 'test123@med.com',
  postalCode: 'V00 000',
  province: 'British Columbia',
  city: 'Victoria',
};

const organizationProviderType = 'TEST-PROVIDER';

function createAuth(permissions) {
  return {
    auth: {
      userInfo: {
        serverTime: new Date(),
      },
      isAuthenticated: true,
      permissions,
    },
  };
}

function mountWithPinia(initialState = {}, overrideProps = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    const onFacilityUpdated = cy.spy().as('facilityUpdatedSpy');

    cy.mount(ManageFacilityDetails, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
        },
      },
      attrs: {
        'onFacility-updated': onFacilityUpdated,
      },
      props: {
        ...overrideProps,
      },
    });

    cy.wrap(pushStub).as('routerPush');
  });
}

function mountWithOrgAndFacility(overrideProps = {}) {
  return mountWithPinia(
    { organization: { organizationProviderType } },
    { facility: facility1, facilityLoading: false, ...overrideProps },
  );
}

describe('<ManageFacilityDetails />', () => {
  it('should show loader skeleton on initial load', () => {
    mountWithPinia({}, { facility: facility1, facilityLoading: true });
    cy.get('.v-skeleton-loader').should('exist');
  });

  it('should not show loader skeleton when facilities are loaded', () => {
    mountWithOrgAndFacility();
    cy.get('.v-skeleton-loader').should('not.exist');
  });

  it('should render the first card row with facility prop details', () => {
    mountWithOrgAndFacility();

    cy.contains('div', '*Facility Name:').next('div').should('contain.text', facility1.facilityName);
    cy.contains('div', '*Funding Type:').next('div').should('contain.text', capitalize(organizationProviderType));
    cy.contains('div', 'Community Care Facility Licence #:')
      .next('div')
      .should('contain.text', facility1.licenseNumber);

    cy.contains('div', 'Facility ID:').next('div').should('contain.text', facility1.facilityAccountNumber);
    cy.contains('div', '*Business Phone:').next('div').should('contain.text', facility1.phone);
  });

  it('should be able to edit business phone', () => {
    mountWithPinia(
      {
        organization: { organizationProviderType },
        ...createAuth([PERMISSIONS.UPDATE_FACILITY_INFORMATION]),
      },
      { facility: facility1, facilityLoading: false },
    );

    cy.contains('div', '*Business Phone:').next('div').find('button').contains('Edit').click();
    cy.get('input').should('have.value', facility1.phone);
    cy.contains('button', 'Save');
    cy.contains('button', 'Cancel');
  });

  it('should not make a backend request when saving without modifying the phone number', () => {
    mountWithPinia(
      {
        organization: { organizationProviderType },
        ...createAuth([PERMISSIONS.UPDATE_FACILITY_INFORMATION]),
      },
      { facility: facility1, facilityLoading: false },
    );

    cy.contains('div', '*Business Phone:').next('div').find('button').contains('Edit').click();
    cy.contains('button', 'Save').click();
    cy.get('@facilityUpdatedSpy').should('not.have.been.called');
  });

  it('should render the second card row with facility address details', () => {
    mountWithOrgAndFacility();

    cy.contains('div', 'Facility Street Address:').next('div').should('contain.text', facility1.facilityAddress);
    cy.contains('div', 'City/Town:').next('div').should('contain.text', facility1.city);
    cy.contains('div', 'Province:').next('div').should('contain.text', facility1.province);

    cy.contains('div', 'Postal Code:').next('div').should('contain.text', facility1.postalCode);
    cy.contains('div', 'Facility Email Address:').next('div').should('contain.text', facility1.email);
  });

  it('should be able to edit facility email', () => {
    mountWithPinia(
      {
        organization: { organizationProviderType },
        ...createAuth([PERMISSIONS.UPDATE_FACILITY_INFORMATION]),
      },
      { facility: facility1, facilityLoading: false },
    );

    cy.contains('div', 'Facility Email Address:').next('div').find('button').contains('Edit').click();
    cy.get('input').should('have.value', facility1.email);
    cy.contains('button', 'Save');
    cy.contains('button', 'Cancel');
  });

  it('should be able to edit and save facility email', () => {
    const updatedEmail = 'updatedEmail@email.com';

    cy.intercept('PUT', `${ApiRoutes.FACILITY}/${facility1.facilityId}`, {
      statusCode: 200,
    }).as('updateFacilityDetails');

    mountWithPinia(
      {
        organization: { organizationProviderType },
        ...createAuth([PERMISSIONS.UPDATE_FACILITY_INFORMATION]),
      },
      { facility: facility1, facilityLoading: false },
    );

    cy.contains('div', 'Facility Email Address:').next('div').find('button').contains('Edit').click();
    cy.get('input').clear().type(updatedEmail);
    cy.contains('button', 'Save').click();
    cy.wait('@updateFacilityDetails');
    cy.get('@facilityUpdatedSpy').should('have.been.calledOnce');
  });

  it('should not be able to edit facility email or business phone', () => {
    const permWithoutUpdateFacInfo = Object.values(PERMISSIONS).filter(
      (permission) => permission !== PERMISSIONS.UPDATE_FACILITY_INFORMATION,
    );
    mountWithPinia(
      {
        organization: { organizationProviderType },
        ...createAuth(permWithoutUpdateFacInfo),
      },
      { facility: facility1, facilityLoading: false },
    );

    cy.contains('button', 'Edit').should('not.exist');
  });

  it('should not make a backend request when saving without modifying the email', () => {
    mountWithPinia(
      {
        organization: { organizationProviderType },
        ...createAuth([PERMISSIONS.UPDATE_FACILITY_INFORMATION]),
      },
      { facility: facility1, facilityLoading: false },
    );

    cy.contains('div', 'Facility Email Address:').next('div').find('button').contains('Edit').click();
    cy.contains('button', 'Save').click();
    cy.get('@facilityUpdatedSpy').should('not.have.been.called');
  });
});
