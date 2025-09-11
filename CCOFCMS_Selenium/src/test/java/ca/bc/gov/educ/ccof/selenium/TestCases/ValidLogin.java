package ca.bc.gov.educ.ccof.selenium.TestCases;

import java.lang.reflect.Method;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.annotations.Test;

import ExtentReport.ExtentTestManager;
import baseclass.BaseTest;
import ca.bc.gov.educ.ccof.selenium.PageObjects.CRMSignInCredentialPage;

public class ValidLogin extends BaseTest {

	private static final Logger logger = LogManager.getLogger(ValidLogin.class);

	@Test(priority = 1)
	public void loginToCRM(Method method) throws InterruptedException {
		ExtentTestManager.startTest(method.getName(), "valid login");
		logger.info("Starting the test...");
		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		objCRMSignInCredentialPage.enterUserId(CRM_USERNAME);
		objCRMSignInCredentialPage.clickNext();
		objCRMSignInCredentialPage.enterPassword(CRM_PASSWORD);
		objCRMSignInCredentialPage.clickSignIn();
		objCRMSignInCredentialPage.clickYes();
		Thread.sleep(5000);
		objCRMSignInCredentialPage.clickSignInAgain();
		objCRMSignInCredentialPage.clickOrgFacilities();
		// objCRMSignInCredentialPage.clickheaderPicture();
		// objCRMSignInCredentialPage.clicksignOut();
	}

}
