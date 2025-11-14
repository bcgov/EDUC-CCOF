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

public class TestAdjudicateRenewalFullCcof extends BaseTest {

	private static final Logger logger = LogManager.getLogger(TestAdjudicateRenewalFullCcof.class);

	@Test(priority = 1)
	public void adjudicateRenewalCcof(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "AdjudicateRenewalCcof");
		logger.info("Starting the AdjudicateRenewalCcof test...");

		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		Utilities ut = new Utilities(driver);

		// login to application
		ut.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforeEnterUserId());
		objCRMSignInCredentialPage.enterUserId(CRM_USERNAME);
		objCRMSignInCredentialPage.clickNext();
		ut.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforePasswordEntered());
		objCRMSignInCredentialPage.enterPassword(CRM_PASSWORD);
		ut.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforeClickSignIn());
		objCRMSignInCredentialPage.clickSignIn();
		ut.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforeClickYes());
		objCRMSignInCredentialPage.clickYes();
		ut.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforeClickSignInAgain());
		objCRMSignInCredentialPage.clickSignInAgain();
		Thread.sleep(5000);
		objCRMSignInCredentialPage.switchToAppsDashboardIFrame();
		ut.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforeClickOrgFacilities());
		objCRMSignInCredentialPage.clickOrgFacilities();
		Thread.sleep(5000);

		DeleteApplicationPage deleteapp = new DeleteApplicationPage(driver);

		// searching the contact
		deleteapp.searchBox(ut.getDataFromJson("contact"));
		Thread.sleep(5000);
		deleteapp.pressEnter();
		Thread.sleep(5000);
		deleteapp.fullName();
		Thread.sleep(5000);

		BCeIDPage bceidpage = new BCeIDPage(driver);
		bceidpage.clickSelectOrganization();

		OrganizationInfoPage orginfo = new OrganizationInfoPage(driver);

		// selecting the application
		ut.waitForElementToLoad(orginfo.getOpenRenewalApplication());
		orginfo.clickRenewalApplication();
		Thread.sleep(3000);

		ApplicationInfoPage appinfo = new ApplicationInfoPage(driver);

		// start of CCOF Adjudication
		appinfo.clickRelatedTab();
		ut.waitForElementToLoad(appinfo.waitBeforeCCFOSLink());
		appinfo.clickCCFOSLink();
		ut.waitForElementToLoad(appinfo.waitBeforeClickCcfos());
		appinfo.clickCcfos();

		CcofPage ccofinfo = new CcofPage(driver);
		ut.waitForElementToLoad(ccofinfo.waitBeforeCcofAdjudicationLink());
		ccofinfo.clickCcofAdjudicationLink();
		Thread.sleep(2000);
		ut.javaScriptExecutorAction(ccofinfo.clickSigningAuthorityBtn());
		Thread.sleep(2000);
		ut.javaScriptExecutorAction(ccofinfo.clickAllLicensesCorrectBtn());
		Thread.sleep(2000);
		ut.javaScriptExecutorAction(ccofinfo.clickBasePayEligibleBtn());
		Thread.sleep(2000);
		ut.javaScriptExecutorAction(ccofinfo.clickBasePayActivatedBtn());
		ut.waitForElementToLoad(ccofinfo.waitBeforeClickSaveBtn());
		ccofinfo.clickSaveBtn();
		ut.waitForElementToLoad(ccofinfo.waitBeforeDashboardLink());
		ccofinfo.clickDashboardLink();
		ut.waitForElementToLoad(ccofinfo.waitBeforeBaseFundingProgressStatusField());
		ccofinfo.clickBaseFundingProgressStatusField();
		Thread.sleep(5000);

		// selecting Confirmed - Active from dropdown
		ut.selectDropdownValue(ut.getDataFromJson("baseFundingProgressStatusOptions"),
				ccofinfo.getBaseFundingProgressStatusOptions());
		ut.waitForElementToLoad(ccofinfo.waitBeforeSaveAndCloseBtn());
		ccofinfo.clickSaveAndCloseBtn();
		ut.waitForElementToLoad(appinfo.waitBeforeCcofTab());
		appinfo.clickCcofTab();

		// changing the CCOF status to Active
		ut.waitForElementToLoad(appinfo.waitBeforeCcofStatus());
		appinfo.clickCcofStatus();
		Thread.sleep(5000);
		ut.selectDropdownValue(ut.getDataFromJson("ccofStatusOptions"), appinfo.getCcofStatusOptions());
		ut.waitForElementToLoad(appinfo.waitBeforeSaveBtn());
		appinfo.clickSaveBtn();
		Thread.sleep(2000);

		logger.info("Ending the TestAdjudicateRenewalFullCcof test...");

	}

}
