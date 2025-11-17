import NewAppIntermediatePage from '@/components/NewAppIntermediatePage.vue';
import vuetify from '@/plugins/vuetify';
import { PATHS, pcfUrl } from '@/utils/constants.js';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    cy.mount(NewAppIntermediatePage, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
        },
      },
    });
    cy.wrap(pushStub).as('routerPush');
  });
}

describe('<NewAppIntermediatePage />', () => {
  it('should render default component text', () => {
    mountWithPinia();
    cy.contains('p', 'Welcome to Child Care Operating Funding (CCOF)');
    cy.contains(
      'p',
      'If your organization currently receives funding from the Child Care Operating Funding (CCOF) program',
    );
  });

  it('should render two buttons on component', () => {
    mountWithPinia();
    cy.get('button').should('have.length', 2);
  });

  it('should render `Cancel` button and redirect to landing page on click', () => {
    mountWithPinia();
    cy.contains('button', 'Cancel').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.HOME);
  });

  it('should render `Start Application` button and redirect to select app type page', () => {
    const programYearId = '1234';
    mountWithPinia({
      app: {
        programYearList: {
          newApp: {
            programYearId,
          },
        },
      },
    });
    cy.contains('button', 'Start Application').click();
    cy.get('@routerPush').should('have.been.calledWith', pcfUrl(PATHS.SELECT_APPLICATION_TYPE, programYearId));
  });
});
