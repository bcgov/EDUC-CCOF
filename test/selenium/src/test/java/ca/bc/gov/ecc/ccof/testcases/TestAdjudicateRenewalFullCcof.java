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
	String contactName;

	@Test(priority = 1)
	public void adjudicateRenewalCcof(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "AdjudicateRenewalCcof");
		logger.info("Starting the AdjudicateRenewalCcof test...");

		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		Utilities utils = new Utilities(driver);
		contactName = utils.getDataFromJson("contact");

		// login to application
		utils.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforeEnterUserId());
		objCRMSignInCredentialPage.enterUserId(CRM_USERNAME);
		objCRMSignInCredentialPage.clickNext();
		utils.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforePasswordEntered());
		objCRMSignInCredentialPage.enterPassword(CRM_PASSWORD);
		utils.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforeClickSignIn());
		objCRMSignInCredentialPage.clickSignIn();
		utils.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforeClickYes());
		objCRMSignInCredentialPage.clickYes();
		utils.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforeClickSignInAgain());
		objCRMSignInCredentialPage.clickSignInAgain();
		Thread.sleep(5000);
		objCRMSignInCredentialPage.switchToAppsDashboardIFrame();
		utils.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforeClickOrgFacilities());
		objCRMSignInCredentialPage.clickOrgFacilities();
		Thread.sleep(5000);

		DeleteApplicationPage deleteApp = new DeleteApplicationPage(driver);

		// searching the contact
		deleteApp.searchAndOpenContact(contactName);

		BCeIDPage bceidPage = new BCeIDPage(driver);
		bceidPage.clickSelectOrganization();

		OrganizationInfoPage orgInfo = new OrganizationInfoPage(driver);

		// selecting the application
		utils.waitForElementToLoad(orgInfo.getOpenRenewalApplication());
		orgInfo.clickRenewalApplication();
		Thread.sleep(3000);

		ApplicationInfoPage appInfo = new ApplicationInfoPage(driver);

		// start of CCOF Adjudication
		appInfo.clickRelatedTab();
		utils.waitForElementToLoad(appInfo.waitBeforeCCFOSLink());
		appInfo.clickCCFOSLink();
		utils.waitForElementToLoad(appInfo.waitBeforeClickCcfos());
		appInfo.clickCcfos();

		CcofPage ccofInfo = new CcofPage(driver);
		utils.waitForElementToLoad(ccofInfo.waitBeforeCcofAdjudicationLink());
		ccofInfo.clickCcofAdjudicationLink();
		Thread.sleep(2000);
		utils.javaScriptExecutorAction(ccofInfo.clickSigningAuthorityBtn());
		Thread.sleep(2000);
		utils.javaScriptExecutorAction(ccofInfo.clickAllLicensesCorrectBtn());
		Thread.sleep(2000);
		utils.javaScriptExecutorAction(ccofInfo.clickBasePayEligibleBtn());
		Thread.sleep(2000);
		utils.javaScriptExecutorAction(ccofInfo.clickBasePayActivatedBtn());
		utils.waitForElementToLoad(ccofInfo.waitBeforeClickSaveBtn());
		ccofInfo.clickSaveBtn();
		utils.waitForElementToLoad(ccofInfo.waitBeforeDashboardLink());
		ccofInfo.clickDashboardLink();
		utils.waitForElementToLoad(ccofInfo.waitBeforeBaseFundingProgressStatusField());
		ccofInfo.clickBaseFundingProgressStatusField();
		Thread.sleep(5000);

		// selecting Confirmed - Active from dropdown
		utils.selectDropdownValue(utils.getDataFromJson("baseFundingProgressStatusOptions"),
				ccofInfo.getBaseFundingProgressStatusOptions());
		utils.waitForElementToLoad(ccofInfo.waitBeforeSaveAndCloseBtn());
		ccofInfo.clickSaveAndCloseBtn();
		utils.waitForElementToLoad(appInfo.waitBeforeCcofTab());
		appInfo.clickCcofTab();

		// changing the CCOF status to Active
		utils.waitForElementToLoad(appInfo.waitBeforeCcofStatus());
		appInfo.clickCcofStatus();
		Thread.sleep(5000);
		utils.selectDropdownValue(utils.getDataFromJson("ccofStatusOptions"), appInfo.getCcofStatusOptions());
		utils.waitForElementToLoad(appInfo.waitBeforeSaveBtn());
		appInfo.clickSaveBtn();
		Thread.sleep(2000);

		logger.info("Ending the TestAdjudicateRenewalFullCcof test...");

	}

}
