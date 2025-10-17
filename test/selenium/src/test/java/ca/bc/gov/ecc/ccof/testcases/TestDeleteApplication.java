package ca.bc.gov.ecc.ccof.testcases;

import java.lang.reflect.Method;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.annotations.Test;

import ca.bc.gov.ecc.ccof.base.BaseTest;
import ca.bc.gov.ecc.ccof.extentreport.ExtentTestManager;
import ca.bc.gov.ecc.ccof.pageobjects.ApplicationInfoPage;
import ca.bc.gov.ecc.ccof.pageobjects.BCeIDPage;
import ca.bc.gov.ecc.ccof.pageobjects.CRMSignInCredentialPage;
import ca.bc.gov.ecc.ccof.pageobjects.DeleteApplicationPage;
import ca.bc.gov.ecc.ccof.pageobjects.OrganizationInfoPage;
import ca.bc.gov.ecc.ccof.utils.Utilities;

public class TestDeleteApplication extends BaseTest {

	private static final Logger logger = LogManager.getLogger(TestDeleteApplication.class);
	Utilities ut;
	CRMSignInCredentialPage objCRMSignInCredentialPage;
	DeleteApplicationPage deleteapp;
	BCeIDPage bceidpage;
	OrganizationInfoPage orginfo;
	ApplicationInfoPage appinfo;

	@Test(priority = 1)
	public void deleteApplication(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "TestDeleteApplication");
		logger.info("Starting the TestDeleteApplication test...");
		objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		ut = new Utilities(driver);
		// login to application
		Thread.sleep(2000);
		objCRMSignInCredentialPage.enterUserId(CRM_USERNAME);
		objCRMSignInCredentialPage.clickNext();
		ut.waitForElement(objCRMSignInCredentialPage.waitBeforePasswordEntered());
		objCRMSignInCredentialPage.enterPassword(CRM_PASSWORD);
		Thread.sleep(2000);
		objCRMSignInCredentialPage.clickSignIn();
		ut.waitForElement(objCRMSignInCredentialPage.waitBeforeClickYes());
		objCRMSignInCredentialPage.clickYes();
		ut.waitForElement(objCRMSignInCredentialPage.waitBeforeClickSignInAgain());
		objCRMSignInCredentialPage.clickSignInAgain();
		Thread.sleep(5000);
		objCRMSignInCredentialPage.switchToAppsDashboardIFrame();
		ut.waitForElement(objCRMSignInCredentialPage.waitBeforeClickOrgFacilities());
		objCRMSignInCredentialPage.clickOrgFacilities();
		Thread.sleep(3000);
		deleteapp = new DeleteApplicationPage(driver);
		// searching the contact
		deleteapp.searchBox("QA218 OFM");
		Thread.sleep(3000);
		deleteapp.pressEnter();
		Thread.sleep(5000);
		deleteapp.fullName();
		Thread.sleep(3000);
		bceidpage = new BCeIDPage(driver);
		bceidpage.clickSelectOrganization();
		Thread.sleep(3000);
		orginfo = new OrganizationInfoPage(driver);
		// selecting the application
		orginfo.clickMainApplication();
		Thread.sleep(5000);
		appinfo = new ApplicationInfoPage(driver);
		// deleting the application
		appinfo.clickDeleteBtn();
		Thread.sleep(3000);
		appinfo.clickDeleteConfirmBtn();
		Thread.sleep(5000);
		// verifying the application is deleted
		ut.assertElementDeleted(orginfo.getOpenApplications());
		logger.info("Ending the TestDeleteApplication test...");

	}

}
