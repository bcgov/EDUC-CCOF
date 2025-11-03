import ClosureChangeRequestDialog from '@/components/closure/ClosureChangeRequestDialog.vue';
import vuetify from '@/plugins/vuetify';
import {
  CHANGE_REQUEST_EXTERNAL_STATUS,
  CHANGE_REQUEST_TYPES,
  ORGANIZATION_GOOD_STANDING_STATUSES,
  ORGANIZATION_PROVIDER_TYPES,
  PATHS,
  pcfUrl,
  pcfUrlGuid,
} from '@/utils/constants.js';
import { PERMISSIONS } from '@/utils/constants/permissions';

const programYearId = '1234';

function mountWithPinia(initialState = {}, dataOverride = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    cy.mount(ClosureChangeRequestDialog, {
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
          ...dataOverride,
        };
      },
      props: {
        programYearId,
        requestType: CHANGE_REQUEST_TYPES.NEW_CLOSURE,
      },
    });
    cy.wrap(pushStub).as('routerPush');
  });
}

describe('<ClosureChangeRequestDialog />', () => {
  beforeEach(() => {
    cy.viewport(1020, 1300);
  });

  it('should render default dialog content', () => {
    mountWithPinia(
      {
        app: {
          programYearList: {
            list: [{ programYearId, name: 'TST-AAA' }],
          },
        },
      },
      { isDisplayed: true },
    );

    cy.contains('h1', 'Fiscal Year: TST-');
    cy.contains('Closures may impact your CCFRI payments. See the');
    cy.contains('h3', 'Select a Facility:');
  });
});
