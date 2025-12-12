package ca.bc.gov.ecc.ccof.testcases;

import java.lang.reflect.Method;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.annotations.Test;

import ca.bc.gov.ecc.ccof.base.BaseTest;
import ca.bc.gov.ecc.ccof.extentreport.ExtentTestManager;
import ca.bc.gov.ecc.ccof.pageobjects.CRMSignInCredentialPage;
import ca.bc.gov.ecc.ccof.pageobjects.DeleteApplicationPage;
import ca.bc.gov.ecc.ccof.utils.Utilities;

public class TestDelinkApplication extends BaseTest {

	private static final Logger logger = LogManager.getLogger(TestDelinkApplication.class);

	@Test(priority = 1)
	public void delinkapplication(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "TestDelinkApplication ");
		logger.info("Starting the deleteApplication test...");

		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		Utilities utils = new Utilities(driver);

		// login to application
		Thread.sleep(2000);
		objCRMSignInCredentialPage.enterUserId(CRM_USERNAME);
		objCRMSignInCredentialPage.clickNext();
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforePasswordEntered());
		objCRMSignInCredentialPage.enterPassword(CRM_PASSWORD);
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforeClickSignIn());
		objCRMSignInCredentialPage.clickSignIn();
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforeClickYes());
		objCRMSignInCredentialPage.clickYes();
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforeClickSignInAgain());
		objCRMSignInCredentialPage.clickSignInAgain();
		Thread.sleep(5000);
		objCRMSignInCredentialPage.switchToAppsDashboardIFrame();
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforeClickOrgFacilities());
		objCRMSignInCredentialPage.clickOrgFacilities();

		DeleteApplicationPage deleteApp = new DeleteApplicationPage(driver);
		Thread.sleep(5000);

		// searching the contact
		deleteApp.searchBox(utils.getDataFromJson("contact"));
		Thread.sleep(5000);
		deleteApp.pressEnter();
		Thread.sleep(5000);

		// selecting the contact
		deleteApp.fullName();

		// delinking the Main Organization
		utils.waitForElement(deleteApp.waitBeforeCancelBtn());
		deleteApp.cancelBtn();
		Thread.sleep(2000);
		deleteApp.selectIdCheckBox();
		utils.waitForElement(deleteApp.waitBeforeThreeDotsBtn());
		deleteApp.threeDotsBtn();

		// delete the BCeID Organization
		utils.mouseOverAction(deleteApp.mouseOverDelete());
		Thread.sleep(5000);
		deleteApp.deleteBtnPopup();
		Thread.sleep(5000);
		deleteApp.saveAndCloseBtn();

		// Handles Ignore and Save pop up if appears
		utils.clickIfPresent(deleteApp.ignoreAndSaveButton());

		logger.info("Ending the deleteApplication test...");

	}

}
