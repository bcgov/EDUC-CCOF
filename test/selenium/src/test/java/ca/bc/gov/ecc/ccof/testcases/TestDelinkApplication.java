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
		logger.info("Starting the DeleteApplication test...");

		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		Utilities ut = new Utilities(driver);

		// login to application
		Thread.sleep(2000);
		objCRMSignInCredentialPage.enterUserId(CRM_USERNAME);
		objCRMSignInCredentialPage.clickNext();
		ut.waitForElement(objCRMSignInCredentialPage.waitBeforePasswordEntered());
		objCRMSignInCredentialPage.enterPassword(CRM_PASSWORD);
		ut.waitForElement(objCRMSignInCredentialPage.waitBeforeClickSignIn());
		objCRMSignInCredentialPage.clickSignIn();
		ut.waitForElement(objCRMSignInCredentialPage.waitBeforeClickYes());
		objCRMSignInCredentialPage.clickYes();
		ut.waitForElement(objCRMSignInCredentialPage.waitBeforeClickSignInAgain());
		objCRMSignInCredentialPage.clickSignInAgain();
		Thread.sleep(5000);
		objCRMSignInCredentialPage.switchToAppsDashboardIFrame();
		ut.waitForElement(objCRMSignInCredentialPage.waitBeforeClickOrgFacilities());
		objCRMSignInCredentialPage.clickOrgFacilities();

		DeleteApplicationPage deleteapp = new DeleteApplicationPage(driver);
		Thread.sleep(5000);

		// searching the contact
		deleteapp.searchBox(ut.getDataFromJson("contact"));
		Thread.sleep(5000);
		deleteapp.pressEnter();
		Thread.sleep(5000);

		// selecting the contact
		deleteapp.fullName();

		// delinking the Main Organization
		ut.waitForElement(deleteapp.waitBeforeCancelBtn());
		deleteapp.cancelBtn();
		Thread.sleep(2000);
		deleteapp.selectIdCheckBox();
		ut.waitForElement(deleteapp.waitBeforeThreeDotsBtn());
		deleteapp.threeDotsBtn();

		// delete the BCeID Organization
		ut.mouseOverAction(deleteapp.mouseOverDelete());
		Thread.sleep(5000);
		deleteapp.deleteBtnPopup();
		Thread.sleep(5000);
		deleteapp.saveAndCloseBtn();

		// Handles Ignore and Save pop up if appears
		ut.clickIfPresent(deleteapp.ignoreAndSaveButton());

		logger.info("Ending the DeleteApplication test...");

	}

}
