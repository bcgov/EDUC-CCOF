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
import ca.bc.gov.ecc.ccof.pageobjects.CcofPage;
import ca.bc.gov.ecc.ccof.pageobjects.DeleteApplicationPage;
import ca.bc.gov.ecc.ccof.pageobjects.OrganizationInfoPage;
import ca.bc.gov.ecc.ccof.utils.Utilities;

public class TestAdjudicateGroupApplicationCcof extends BaseTest {

	private static final Logger logger = LogManager.getLogger(TestAdjudicateGroupApplicationCcfri.class);
	Utilities ut;

	@Test(priority = 1)
	public void AdjudicateGroupApplicationsCcof(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "AdjudicateGroupApplicationCcof");
		logger.info("Starting the AdjudicateGroupApplicationCcof test...");
		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		ut = new Utilities(driver);
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
		Thread.sleep(5000);
		DeleteApplicationPage deleteapp = new DeleteApplicationPage(driver);
		deleteapp.searchBox("QA218 OFM");
		Thread.sleep(5000);
		deleteapp.pressEnter();
		Thread.sleep(5000);
		deleteapp.fullName();
		Thread.sleep(5000);
		BCeIDPage bceidpage = new BCeIDPage(driver);
		bceidpage.clickSelectOrganization();
		Thread.sleep(5000);
		OrganizationInfoPage orginfo = new OrganizationInfoPage(driver);
		orginfo.clickApplication();
		Thread.sleep(5000);
		ApplicationInfoPage appinfo = new ApplicationInfoPage(driver);

		// start of CCOF Adjudication
		appinfo.clickRelatedTab();
		Thread.sleep(5000);
		appinfo.clickCCFOSLink();
		Thread.sleep(5000);
		appinfo.clickCcfos();
		Thread.sleep(5000);
		CcofPage ccofinfo = new CcofPage(driver);
		ccofinfo.clickCcofAdjudicationLink();
		Thread.sleep(5000);
		ut.javaScriptExecutorAction(ccofinfo.clickNewApplicationIsSignedBtn());
		Thread.sleep(5000);
		ut.javaScriptExecutorAction(ccofinfo.clickApplicationFormAndLicenseSubmittedBtn());
		Thread.sleep(5000);
		ut.javaScriptExecutorAction(ccofinfo.clickLegalNameAndLicenseMatchBtn());
		Thread.sleep(5000);
		ut.javaScriptExecutorAction(ccofinfo.clickLicenseValidInHealthSpaceBtn());
		Thread.sleep(5000);
		ut.javaScriptExecutorAction(ccofinfo.clickMailingAddressInCasSupplierBtn());
		Thread.sleep(5000);
		ut.javaScriptExecutorAction(ccofinfo.clickProviderInGoodStandingBtn());
		Thread.sleep(5000);
		ut.javaScriptExecutorAction(ccofinfo.clickBasePayEligibleBtn());
		Thread.sleep(5000);
		ut.javaScriptExecutorAction(ccofinfo.clickBasePayActivatedBtn());
		Thread.sleep(5000);
		ccofinfo.clickSaveBtn();
		Thread.sleep(5000);
		ccofinfo.clickDashboardLink();
		Thread.sleep(5000);
		ccofinfo.clickBaseFundingProgressStatusField();
		Thread.sleep(5000);
		ut.selectDropdownValue("Confirmed - Active", ccofinfo.getBaseFundingProgressStatusOptions());
		Thread.sleep(5000);
		ccofinfo.clickSaveAndCloseBtn();
		Thread.sleep(10000);
		appinfo.clickCcofTab();
		Thread.sleep(5000);
		appinfo.clickCcofStatus();
		Thread.sleep(5000);
		ut.selectDropdownValue("Active", appinfo.getCcofStatusOptions());
		Thread.sleep(5000);
		appinfo.clickSaveBtn();
		Thread.sleep(5000);

		logger.info("Ending the AdjudicateGroupApplicationCcof test...");

	}

}
