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
		Utilities ut = new Utilities(driver);

		// login to application
		Thread.sleep(3000);
		objCRMSignInCredentialPage.enterUserId(CRM_USERNAME);
		objCRMSignInCredentialPage.clickNext();
		ut.waitForElement(objCRMSignInCredentialPage.waitBeforePasswordEntered());
		objCRMSignInCredentialPage.enterPassword(CRM_PASSWORD);
		ut.waitForElement(objCRMSignInCredentialPage.waitBeforeClickSignIn());
		objCRMSignInCredentialPage.clickSignIn();
		Thread.sleep(3000);
		objCRMSignInCredentialPage.clickYes();
		ut.waitForElement(objCRMSignInCredentialPage.waitBeforeClickSignInAgain());
		objCRMSignInCredentialPage.clickSignInAgain();
		Thread.sleep(5000);
		objCRMSignInCredentialPage.switchToAppsDashboardIFrame();
		ut.waitForElement(objCRMSignInCredentialPage.waitBeforeClickOrgFacilities());
		objCRMSignInCredentialPage.clickOrgFacilities();
		Thread.sleep(3000);

		DeleteApplicationPage deleteapp = new DeleteApplicationPage(driver);

		// searching the contact
		deleteapp.searchBox(ut.getDataFromJson("contact"));
		Thread.sleep(3000);
		deleteapp.pressEnter();
		Thread.sleep(5000);
		deleteapp.fullName();
		Thread.sleep(3000);

		BCeIDPage bceidpage = new BCeIDPage(driver);
		bceidpage.clickSelectOrganization();
		Thread.sleep(3000);

		OrganizationInfoPage orginfo = new OrganizationInfoPage(driver);

		// selecting the application
		orginfo.clickMainApplication();
		Thread.sleep(5000);

		ApplicationInfoPage appinfo = new ApplicationInfoPage(driver);

		// navigating to related tab
		appinfo.clickRelatedTab();
		Thread.sleep(5000);

		// navigating to CCFRIs in related Tab
		appinfo.clickCCFRISLink();
		Thread.sleep(5000);
		appinfo.clickCcfri();
		Thread.sleep(5000);

		CcfrisInfoPage ccfriinfo = new CcfrisInfoPage(driver);

		ccfriinfo.clickUnlockBtn();
		Thread.sleep(5000);

		CcfriUnlockForm ccfriunlock = new CcfriUnlockForm(driver);
		// filling the unlock form
		ut.javaScriptExecutorAction(ccfriunlock.clickDeclarationUnlockBtn());
		Thread.sleep(3000);
		ut.javaScriptExecutorAction(ccfriunlock.clickCcofNewOrgBtn());
		Thread.sleep(3000);
		ut.javaScriptExecutorAction(ccfriunlock.clickLicenceUploadBtn());
		Thread.sleep(3000);
		ut.javaScriptExecutorAction(ccfriunlock.clickEceweBtn());
		Thread.sleep(3000);
		ut.javaScriptExecutorAction(ccfriunlock.clickSupportingDocBtn());
		Thread.sleep(3000);
		ut.javaScriptExecutorAction(ccfriunlock.clickCcfriUnlockBtn());
		Thread.sleep(3000);
		ut.javaScriptExecutorAction(ccfriunlock.clickRfiUnlockBtn());
		Thread.sleep(3000);
		ut.javaScriptExecutorAction(ccfriunlock.clickNmfUnlockBtn());
		Thread.sleep(5000);
		ccfriunlock.enterUnlockReasonTxtBox("PCFUnlock");
		Thread.sleep(3000);
		ut.scrollToElement(ccfriunlock.clickConfirmAndCloseBtn());
		Thread.sleep(3000);
		// TODO neha - handle final status change after the bug isCCFRI-6285 is fixed
		logger.info("Ending the TestPCFMainApplication test...");

	}

}
