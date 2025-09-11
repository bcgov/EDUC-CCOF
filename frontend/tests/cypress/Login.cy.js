import { ApiRoutes, AuthRoutes, PATHS } from '@/utils/constants.js';

import Login from '@/components/Login.vue';
import router from '@/router';
import vuetify from '@/plugins/vuetify';

describe('<Login />', () => {
  let plugins;

  beforeEach(() => {
    cy.setupPinia({ stubActions: true }).then((pinia) => {
      plugins = [pinia, router, vuetify];

      cy.intercept('GET', ApiRoutes.SYSTEM_MESSAGES, { statusCode: 200, body: [] });

      cy.mount(Login, {
        global: { plugins },
      });
    });
  });

  it('should render the header image', () => {
    cy.get('img').should('have.attr', 'src').and('include', 'login-header-img-resized.jpg');
  });

  it('should display the legal notice paragraph', () => {
    cy.get('p')
      .contains('The information collected through My ChildCareBC Services is collected under the authority of the')
      .should('exist');
  });

  it('should not render system message cards if systemMessages is empty', () => {
    cy.get('.noticeInfo').should('not.exist');
  });

  it('should display system messages', () => {
    cy.intercept('GET', ApiRoutes.SYSTEM_MESSAGES, {
      statusCode: 200,
      body: [
        { messageID: 1, message: 'Test system message 1' },
        { messageID: 2, message: 'Test system message 2' },
        { messageID: 3, message: 'Test system message 3' },
      ],
    }).as('getSystemMessages');

    cy.setupPinia({ stubActions: true }).then((pinia) => {
      cy.mount(Login, {
        global: {
          plugins: [pinia, router, vuetify],
        },
      });
    });

    cy.wait('@getSystemMessages');
    cy.get('.noticeInfo').eq(0).should('contain.text', 'Test system message 1');
    cy.get('.noticeInfo').eq(1).should('contain.text', 'Test system message 2');
    cy.get('.noticeInfo').eq(2).should('contain.text', 'Test system message 3');
  });

  it('each major card should have a button with correct text', () => {
    cy.contains('h4', 'Log in to My ChildCareBC Services')
      .closest('.v-card')
      .find('.v-btn')
      .should('exist')
      .should('have.attr', 'href', AuthRoutes.LOGIN)
      .and('contain.text', 'Log In');

    cy.contains('h4', "Don't have a BCeID?")
      .closest('.v-card')
      .find('.v-btn')
      .should('exist')
      .and('contain.text', 'Register for a BCeID');

    cy.contains('h4', 'CCFRI Estimator')
      .closest('.v-card')
      .find('.v-btn')
      .should('exist')
      .and('contain.text', 'Go to Estimator');
  });

  it('should navigate to estimator path', () => {
    cy.spy(router, 'push').as('routerPush');
    cy.contains('button', 'Go to Estimator').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.ESTIMATOR);
  });
});
