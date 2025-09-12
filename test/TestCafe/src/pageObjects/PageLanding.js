const { getButton } = require('../utils/selectors');

class PageLanding {

  constructor() {
    this.continueButton = getButton('Continue Application');
    this.renewButton = getButton('Renew my funding');
    this.changeButton = getButton('Make a change');
    this.submitReportButton = getButton('Submit reports');

  }
}
export default PageLanding;
