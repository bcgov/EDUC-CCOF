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
		Thread.sleep(2000);
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforePasswordEntered());
        logger.info("Enter password");
		objCRMSignInCredentialPage.enterPassword(CRM_PASSWORD);
		Thread.sleep(2000);
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforeClickSignIn());
        logger.info("Click sign in");
		objCRMSignInCredentialPage.clickSignIn();

		try {
			logger.info("After clickSignIn - current URL: " + driver.getCurrentUrl());
			logger.info("After clickSignIn - page title: " + driver.getTitle());
			int idButtonCount = driver.findElements(By.id("idSIButton9")).size();
			logger.info("After clickSignIn - count of elements with id 'idSIButton9': " + idButtonCount);
			int iframeCount = driver.findElements(By.tagName("iframe")).size();
			logger.info("After clickSignIn - iframe count on page: " + iframeCount);
			// If present, log the text of the element (shortened) for extra debug
			if (idButtonCount > 0) {
				String btnText = driver.findElement(By.id("idSIButton9")).getText();
				logger.info("After clickSignIn - idSIButton9 text (first 200 chars): " + (btnText.length() > 200 ? btnText.substring(0,200) : btnText));
			}
		} catch (Exception e) {
			logger.info("After clickSignIn - failed to log additional diagnostics", e);
		}

		utils.waitForElement(objCRMSignInCredentialPage.waitBeforeClickYes());
        logger.info("Click yes");
		objCRMSignInCredentialPage.clickYes();
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
