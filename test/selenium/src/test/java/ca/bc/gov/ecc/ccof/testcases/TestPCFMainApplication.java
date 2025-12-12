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
import ca.bc.gov.ecc.ccof.pageobjects.CcfriUnlockForm;
import ca.bc.gov.ecc.ccof.pageobjects.CcfrisInfoPage;
import ca.bc.gov.ecc.ccof.pageobjects.DeleteApplicationPage;
import ca.bc.gov.ecc.ccof.pageobjects.OrganizationInfoPage;
import ca.bc.gov.ecc.ccof.utils.Utilities;

public class TestPCFMainApplication extends BaseTest {

	private static final Logger logger = LogManager.getLogger(TestPCFMainApplication.class);

	@Test(priority = 1)
	public void unlockPCFApplication(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "TestPCFMainApplication");
		logger.info("Starting the TestPCFMainApplication test...");

		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		Utilities utils = new Utilities(driver);

		// login to application
		Thread.sleep(3000);
		objCRMSignInCredentialPage.enterUserId(CRM_USERNAME);
		objCRMSignInCredentialPage.clickNext();
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforePasswordEntered());
		objCRMSignInCredentialPage.enterPassword(CRM_PASSWORD);
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforeClickSignIn());
		objCRMSignInCredentialPage.clickSignIn();
		Thread.sleep(3000);
		objCRMSignInCredentialPage.clickYes();
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforeClickSignInAgain());
		objCRMSignInCredentialPage.clickSignInAgain();
		Thread.sleep(5000);
		objCRMSignInCredentialPage.switchToAppsDashboardIFrame();
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforeClickOrgFacilities());
		objCRMSignInCredentialPage.clickOrgFacilities();
		Thread.sleep(3000);

		DeleteApplicationPage deleteApp = new DeleteApplicationPage(driver);

		// searching the contact
		deleteApp.searchBox(utils.getDataFromJson("contact"));
		Thread.sleep(3000);
		deleteApp.pressEnter();
		Thread.sleep(5000);
		deleteApp.fullName();
		Thread.sleep(3000);

		BCeIDPage bceidPage = new BCeIDPage(driver);
		bceidPage.clickSelectOrganization();
		Thread.sleep(3000);

		OrganizationInfoPage orgInfo = new OrganizationInfoPage(driver);

		// selecting the application
		orgInfo.clickMainApplication();
		Thread.sleep(5000);

		ApplicationInfoPage appInfo = new ApplicationInfoPage(driver);

		// navigating to related tab
		appInfo.clickRelatedTab();
		Thread.sleep(5000);

		// navigating to CCFRIs in related Tab
		appInfo.clickCCFRISLink();
		Thread.sleep(5000);
		appInfo.clickCcfri();
		Thread.sleep(5000);

		CcfrisInfoPage ccfriInfo = new CcfrisInfoPage(driver);

		ccfriInfo.clickUnlockBtn();
		Thread.sleep(5000);

		CcfriUnlockForm ccfriUnlock = new CcfriUnlockForm(driver);
		// filling the unlock form
		utils.javaScriptExecutorAction(ccfriUnlock.clickDeclarationUnlockBtn());
		Thread.sleep(3000);
		utils.javaScriptExecutorAction(ccfriUnlock.clickCcofNewOrgBtn());
		Thread.sleep(3000);
		utils.javaScriptExecutorAction(ccfriUnlock.clickLicenceUploadBtn());
		Thread.sleep(3000);
		utils.javaScriptExecutorAction(ccfriUnlock.clickEceweBtn());
		Thread.sleep(3000);
		utils.javaScriptExecutorAction(ccfriUnlock.clickSupportingDocBtn());
		Thread.sleep(3000);
		utils.javaScriptExecutorAction(ccfriUnlock.clickCcfriUnlockBtn());
		Thread.sleep(3000);
		utils.javaScriptExecutorAction(ccfriUnlock.clickRfiUnlockBtn());
		Thread.sleep(3000);
		utils.javaScriptExecutorAction(ccfriUnlock.clickNmfUnlockBtn());
		Thread.sleep(5000);
		ccfriUnlock.enterUnlockReasonTxtBox("PCFUnlock");
		Thread.sleep(3000);
		utils.scrollToElement(ccfriUnlock.clickConfirmAndCloseBtn());
		Thread.sleep(3000);
		// TODO neha - handle final status change after the bug isCCFRI-6285 is fixed
		logger.info("Ending the TestPCFMainApplication test...");

	}

}
