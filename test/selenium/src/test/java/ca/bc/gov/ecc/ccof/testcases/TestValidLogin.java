package ca.bc.gov.ecc.ccof.testcases;

import java.lang.reflect.Method;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.annotations.Test;
import org.openqa.selenium.By;

import ca.bc.gov.ecc.ccof.base.BaseTest;
import ca.bc.gov.ecc.ccof.extentreport.ExtentTestManager;
import ca.bc.gov.ecc.ccof.pageobjects.CRMSignInCredentialPage;
import ca.bc.gov.ecc.ccof.utils.Utilities;

public class TestValidLogin extends BaseTest {

	private static final Logger logger = LogManager.getLogger(TestValidLogin.class);

	@Test(priority = 1)
	public void loginToCRM(Method method) throws InterruptedException {
		ExtentTestManager.startTest(method.getName(), "valid login");
		logger.info("Starting the test...");

		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		Utilities utils = new Utilities(driver);
		Thread.sleep(2000);
        logger.info("Enter username");
		objCRMSignInCredentialPage.enterUserId(CRM_USERNAME);
        logger.info("Click next");
		objCRMSignInCredentialPage.clickNext();
        logger.info("Next clicked");
		Thread.sleep(2000);
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforePasswordEntered());
        logger.info("Enter password");
		objCRMSignInCredentialPage.enterPassword(CRM_PASSWORD);
        logger.info("Password entered");
		Thread.sleep(2000);
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforeClickSignIn());
        logger.info("Click sign in");
		objCRMSignInCredentialPage.clickSignIn();
        logger.info("Sign in clicked");
        logger.info("Wait for YES");
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforeClickYes());
        logger.info("Yes found");
        logger.info("Click yes");
		objCRMSignInCredentialPage.clickYes();
        logger.info("Yes clicked");
		Thread.sleep(2000);
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforeClickSignInAgain());
        logger.info("Click sign in again");
		objCRMSignInCredentialPage.clickSignInAgain();
		Thread.sleep(5000);
		objCRMSignInCredentialPage.switchToAppsDashboardIFrame();
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforeClickOrgFacilities());
        logger.info("Click org facilities");
		objCRMSignInCredentialPage.clickOrgFacilities();
	}

}
