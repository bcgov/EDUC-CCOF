import { Selector } from 'testcafe';

class PageAlert {

  constructor() {
    this.success = Selector('div').withText('Success!');
    this.error = Selector('div').withText('An error occurred while saving. Please try again later.');
    this.submit = Selector('div').withText('Submission Complete');
  }
}
export default PageAlert;