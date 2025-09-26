package ca.bc.gov.ecc.ccof.testcases;

import java.lang.reflect.Method;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.Assert;
import org.testng.annotations.Test;

import ca.bc.gov.ecc.ccof.baseclass.BaseTest;
import ca.bc.gov.ecc.ccof.extentreport.ExtentTestManager;
import ca.bc.gov.ecc.ccof.pageobjects.CRMSignInCredentialPage;

public class InValidLogin extends BaseTest {

	private static final Logger logger = LogManager.getLogger(InValidLogin.class);

	@Test(priority = 2)
	public void loginToCRM(Method method) throws InterruptedException {
		ExtentTestManager.startTest(method.getName(), "Invalid login");
		logger.info("Starting the test...");
		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);

		// --- Scenario 1: Wrong password ---
		objCRMSignInCredentialPage.enterUserId(CRM_USERNAME);
		objCRMSignInCredentialPage.clickNext();
		objCRMSignInCredentialPage.enterPassword("wrongPassword");
		objCRMSignInCredentialPage.clickSignIn();
		logger.info("Capturing error message...");
		String actualError = objCRMSignInCredentialPage.getInvalidLoginErrorMessage();
		logger.info("Asserting error message...");
		Assert.assertTrue(actualError.contains("incorrect") || actualError.contains("invalid"),
				"Expected login error message not displayed. Found: " + actualError);
		logger.info("Invalid login (wrong password) test completed.");

		// --- Scenario 2: Empty password ---
		logger.info("Testing empty password scenario...");
		logger.info("Leaving password field empty and clicking Sign In...");
		objCRMSignInCredentialPage.enterPassword(""); // empty string
		objCRMSignInCredentialPage.clickSignIn();
		logger.info("Capturing error message for empty password...");
		String emptyPassError = objCRMSignInCredentialPage.getInvalidLoginErrorMessage();
		Assert.assertTrue(
				emptyPassError.toLowerCase().contains("enter") || emptyPassError.toLowerCase().contains("password"),
				"Expected empty password error not displayed. Found: " + emptyPassError);
		logger.info("Empty password test passed.");
		logger.info("Invalid login test completed.");
	}

}
