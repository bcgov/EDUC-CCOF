import { Selector } from 'testcafe';
const config = require('../utils/configLoader');

class PagekKeyCloakLogin {
  constructor() {
    this.username = Selector('#user');
    this.password = Selector('#password');
    this.submitButton = Selector('input[name=\'btnSubmit\']');
  }

  async login(t, credentials) {
    await t
      .expect(this.password.count).eql(1)
      .typeText(this.username, credentials.username)
      .typeText(this.password, credentials.password)
      .click(this.submitButton);
  }
}

class PageLogin {

  constructor() {
    this.loginBtn = Selector('#login-button');
  }

  async bceIdLogin(t) {
    const keyCloakLoginPage = new PagekKeyCloakLogin();
    await t
      .click(this.loginBtn)
      .expect(Selector('#bceidLogo').exists).ok({ timeout: 10000 });
    await keyCloakLoginPage.login(t, config.get('bceid_credentials'));
    await t
      .expect(Selector('.v-system-bar').exists).ok({ timeout: 10000 });
  }

  async idirLogin(t) {
    const keyCloakLoginPage = new PagekKeyCloakLogin();
    await t
      .click(this.loginBtn)
      .expect(Selector('#idirLogo').exists).ok({ timeout: 5000 });
    await keyCloakLoginPage.login(t, config.get('idir_credentials'));
    // await t.expect(Selector('#businessBCeId-field').exists).ok({ timeout: 5000 });
  }
}

export default PageLogin;
