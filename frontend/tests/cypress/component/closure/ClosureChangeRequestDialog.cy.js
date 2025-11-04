import ClosureChangeRequestDialog from '@/components/closure/ClosureChangeRequestDialog.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes, CHANGE_REQUEST_TYPES, ERROR_MESSAGES } from '@/utils/constants.js';

const programYearId = '1234';
const facilityId = '123444';

const defaultProgramYearList = [{ programYearId, name: 'TST-ABC' }];
const defaultAppState = { app: { programYearList: { list: defaultProgramYearList } } };

function interceptAPI() {
  cy.intercept('GET', `${ApiRoutes.FACILITY}/${facilityId}/licenseCategories`, {
    statusCode: 200,
    body: [],
  }).as('getLicenseCategories');
}

function mountDialog({ initialState = {}, dataOverride = {}, propOverride = {} } = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    const onCloseDialog = cy.spy().as('closeDialogSpy');

    cy.mount(ClosureChangeRequestDialog, {
      global: {
        plugins: [pinia, vuetify],
        mocks: { $router: { push: pushStub } },
      },
      data() {
        return { ...dataOverride };
      },
      attrs: { onClose: onCloseDialog },
      props: {
        programYearId,
        requestType: CHANGE_REQUEST_TYPES.NEW_CLOSURE,
        ...propOverride,
      },
    }).then(async ({ wrapper }) => {
      cy.wrap(wrapper).as('vueWrapper');
      cy.wrap(pushStub).as('routerPush');
      await wrapper.setProps({ show: true });
      await wrapper.vm.$nextTick();
    });
  });
}

function assertRadioGroup(labelText) {
  cy.contains('h3', labelText).closest('.v-row').find('.v-radio-group').first().as('radioGroup');

  cy.get('@radioGroup').within(() => {
    cy.get('.v-radio').should('have.length', 2);
    cy.contains('Yes');
    cy.contains('No');
  });
}

describe('<ClosureChangeRequestDialog />', () => {
  beforeEach(() => {
    globalThis.localStorage.setItem('jwtToken', 'mocked-jwt-token');
    cy.viewport(3200, 3500);
  });

  afterEach(() => {
    globalThis.localStorage.removeItem('jwtToken');
  });

  it('should render default dialog content', () => {
    mountDialog({ initialState: defaultAppState, dataOverride: { isDisplayed: true } });

    cy.contains('h1', 'Fiscal Year: TST-');
    cy.contains('Closures may impact your CCFRI payments. See the');
    cy.contains('h3', 'Select a Facility:');
  });

  it('should render parents closure payment radio input', () => {
    mountDialog({ initialState: defaultAppState, dataOverride: { isDisplayed: true } });
    assertRadioGroup('Will parents pay for this closure?');
  });

  it('should render full facility closure inputs', () => {
    interceptAPI();
    mountDialog({
      initialState: defaultAppState,
      dataOverride: { isDisplayed: true },
      propOverride: { requestType: null, closure: { facilityId, paidClosure: true, fullClosure: false } },
    });
    cy.wait('@getLicenseCategories');
    assertRadioGroup('Is this a full facility closure?');
  });

  context('Affected Care Categories', () => {
    it('should render input if not full closure', () => {
      interceptAPI();
      mountDialog({
        initialState: defaultAppState,
        dataOverride: { isDisplayed: true },
        propOverride: {
          requestType: null,
          closure: { facilityId, paidClosure: true, fullClosure: false, ageGroups: '1,2,3' },
        },
      });
      cy.wait('@getLicenseCategories');
      cy.contains('Affected Care Categorie(s)');
    });

    it('should render input if full closure', () => {
      interceptAPI();
      mountDialog({
        initialState: defaultAppState,
        dataOverride: { isDisplayed: true },
        propOverride: { requestType: null, closure: { facilityId, paidClosure: true, fullClosure: true } },
      });
      cy.wait('@getLicenseCategories');
      cy.contains('Affected Care Categorie(s)').should('not.exist');
    });
  });

  it('should render approved dates info for edit closure', () => {
    const startDate = '2025-01-10';
    const endDate = '2025-01-15';
    interceptAPI();
    mountDialog({
      initialState: defaultAppState,
      dataOverride: { isDisplayed: true },
      propOverride: {
        requestType: CHANGE_REQUEST_TYPES.EDIT_EXISTING_CLOSURE,
        closure: { facilityId, paidClosure: true, startDate, endDate },
      },
    });
    cy.wait('@getLicenseCategories');
    cy.contains('h3', 'Approved Dates:');
    cy.get('input[type="date"]').eq(0).should('have.value', startDate);
    cy.get('input[type="date"]').eq(1).should('have.value', endDate);
  });

  it('should not render approved dates for new closure', () => {
    interceptAPI();
    mountDialog({
      initialState: defaultAppState,
      dataOverride: { isDisplayed: true },
      propOverride: { requestType: null, closure: { facilityId, paidClosure: true } },
    });
    cy.wait('@getLicenseCategories');
    cy.contains('h3', 'Approved Dates:').should('not.exist');
  });

  it('should render fiscal year error message', () => {
    interceptAPI();
    mountDialog({
      initialState: {
        ...defaultAppState,
        application: { programYearLabel: '2025-26' },
      },
      dataOverride: { isDisplayed: true },
      propOverride: {
        requestType: null,
        closure: { facilityId, paidClosure: true, startDate: '2025-01-10', endDate: '2025-01-15' },
      },
    });
    cy.wait('@getLicenseCategories');
    cy.contains('p', ERROR_MESSAGES.CLOSURE_DATE_OUTSIDE_FUNDING_AGREEMENT_YEAR);
  });

  it('should render start date after end date error message', () => {
    interceptAPI();
    mountDialog({
      initialState: defaultAppState,
      dataOverride: { isDisplayed: true },
      propOverride: {
        requestType: null,
        closure: { facilityId, paidClosure: true, startDate: '2025-01-18', endDate: '2025-01-15' },
      },
    });
    cy.wait('@getLicenseCategories');
    cy.contains('p', ERROR_MESSAGES.START_DATE_AFTER_END_DATE);
  });

  it('should not render errors when dates are valid', () => {
    interceptAPI();
    mountDialog({
      initialState: defaultAppState,
      dataOverride: { isDisplayed: true },
      propOverride: {
        requestType: null,
        closure: { facilityId, paidClosure: true, startDate: '2025-01-10', endDate: '2025-01-15' },
      },
    });
    cy.wait('@getLicenseCategories');
    cy.contains('p', ERROR_MESSAGES.START_DATE_AFTER_END_DATE).should('not.exist');
    cy.contains('p', ERROR_MESSAGES.CLOSURE_DATE_OUTSIDE_FUNDING_AGREEMENT_YEAR).should('not.exist');
  });

  it('should render document upload button', () => {
    interceptAPI();
    mountDialog({
      initialState: defaultAppState,
      dataOverride: { isDisplayed: true },
      propOverride: { requestType: null, closure: { facilityId, paidClosure: true } },
    });
    cy.wait('@getLicenseCategories');
    cy.contains('Supporting Documents(Optional):');
    cy.contains('button', 'Add File');
  });

  it('should render reason for closure removal textarea for removal requests', () => {
    interceptAPI();
    mountDialog({
      initialState: defaultAppState,
      dataOverride: { isDisplayed: true },
      propOverride: { requestType: CHANGE_REQUEST_TYPES.REMOVE_A_CLOSURE, closure: { facilityId, paidClosure: true } },
    });
    cy.wait('@getLicenseCategories');
    cy.contains('h3', 'Reason for closure removal:');
  });

  it('should not render reason textarea for non-removal requests', () => {
    interceptAPI();
    mountDialog({
      initialState: defaultAppState,
      dataOverride: { isDisplayed: true },
      propOverride: { requestType: null, closure: { facilityId, paidClosure: true } },
    });
    cy.wait('@getLicenseCategories');
    cy.contains('h3', 'Reason for closure removal:').should('not.exist');
  });

  it('should render cancel and submit button', () => {
    interceptAPI();
    mountDialog({
      initialState: defaultAppState,
      dataOverride: { isDisplayed: true },
      propOverride: { requestType: null, closure: { facilityId, paidClosure: true } },
    });
    cy.wait('@getLicenseCategories');
    cy.contains('button', 'Cancel').click();
    cy.get('@closeDialogSpy').should('have.been.calledOnce');
    cy.contains('button', 'Submit');
  });

  it('should render remove closure button', () => {
    interceptAPI();
    mountDialog({
      initialState: defaultAppState,
      dataOverride: { isDisplayed: true },
      propOverride: { requestType: CHANGE_REQUEST_TYPES.REMOVE_A_CLOSURE, closure: { facilityId, paidClosure: true } },
    });
    cy.wait('@getLicenseCategories');
    cy.contains('button', 'Remove Closure');
  });
});
