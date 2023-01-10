import { Selector } from 'testcafe';
const { getButton } = require('../utils/selectors');

class PageLanding {

  constructor() {
    this.newButton = getButton('Start Application');
    this.continueButton = getButton('Continue Application');
    this.renewButton = getButton('Renew my funding');
    this.changeButton = getButton('Make a change');
    this.submitReportButton = getButton('Submit reports');
    this.groupButton = Selector('p').withText('Group Provider').parent().parent().find('button');
    this.familyButton = Selector('p').withText('Family Provider').parent().parent().find('button');
  }
}
export default PageLanding;
