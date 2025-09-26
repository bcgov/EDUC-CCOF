package ca.bc.gov.ecc.ccof.testcases;

import java.lang.reflect.Method;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.annotations.Test;

import ca.bc.gov.ecc.ccof.baseclass.BaseTest;
import ca.bc.gov.ecc.ccof.extentreport.ExtentTestManager;
import ca.bc.gov.ecc.ccof.pageobjects.CRMSignInCredentialPage;
import ca.bc.gov.ecc.ccof.pageobjects.DeleteApplicationPage;

public class DeleteApplication extends BaseTest {

	private static final Logger logger = LogManager.getLogger(ValidLogin.class);

	@Test(priority = 1)
	public void Deleteapplication(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "valid login");
		logger.info("Starting the DeleteApplication test...");
		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		objCRMSignInCredentialPage.enterUserId(CRM_USERNAME);
		objCRMSignInCredentialPage.clickNext();
		objCRMSignInCredentialPage.enterPassword(CRM_PASSWORD);
		Thread.sleep(2000);
		objCRMSignInCredentialPage.clickSignIn();
		Thread.sleep(2000);
		objCRMSignInCredentialPage.clickYes();
		Thread.sleep(2000);
		objCRMSignInCredentialPage.clickSignInAgain();
		Thread.sleep(8000);
		objCRMSignInCredentialPage.clickOrgFacilities();
		Thread.sleep(8000);
		DeleteApplicationPage deleteapp = new DeleteApplicationPage(driver);
		deleteapp.searchBox("QA218 OFM");
		Thread.sleep(5000);
		deleteapp.pressEnter();
		Thread.sleep(5000);
		deleteapp.fullName();
		Thread.sleep(5000);
		deleteapp.cancelBtn();
		deleteapp.selectIdCheckBox();
		Thread.sleep(5000);
		deleteapp.threeDotsBtn();
		Thread.sleep(5000);
		deleteapp.mouseOverDelete();
		Thread.sleep(5000);
		deleteapp.deleteBtnPopup();
		Thread.sleep(10000);
		deleteapp.saveAndCloseBtn();
		Thread.sleep(5000);
		deleteapp.ignoreAndSaveBtn();
		logger.info("Ending the DeleteApplication test...");

	}

}
