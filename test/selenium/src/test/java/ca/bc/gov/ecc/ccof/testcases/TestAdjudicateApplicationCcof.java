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

public class TestAdjudicateApplicationCcof extends BaseTest {

	private static final Logger logger = LogManager.getLogger(TestAdjudicateApplicationCcof.class);

	@Test(priority = 1)
	public void adjudicateApplicationsCcof(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "AdjudicateApplicationCcof");
		logger.info("Starting the AdjudicateApplicationCcof test...");

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
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforeClickYes());
		objCRMSignInCredentialPage.clickYes();
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforeClickSignInAgain());
		objCRMSignInCredentialPage.clickSignInAgain();
		Thread.sleep(5000);
		objCRMSignInCredentialPage.switchToAppsDashboardIFrame();
		utils.waitForElement(objCRMSignInCredentialPage.waitBeforeClickOrgFacilities());
		objCRMSignInCredentialPage.clickOrgFacilities();
		Thread.sleep(5000);

		DeleteApplicationPage deleteApp = new DeleteApplicationPage(driver);

		// searching the contact
		deleteApp.searchBox(utils.getDataFromJson("contact"));
		Thread.sleep(5000);
		deleteApp.pressEnter();
		Thread.sleep(5000);
		deleteApp.fullName();
		Thread.sleep(5000);

		BCeIDPage bceidPage = new BCeIDPage(driver);
		bceidPage.clickSelectOrganization();
		Thread.sleep(5000);

		OrganizationInfoPage orgInfo = new OrganizationInfoPage(driver);

		// selecting the application
		orgInfo.clickMainApplication();
		Thread.sleep(5000);

		ApplicationInfoPage appInfo = new ApplicationInfoPage(driver);

		// start of CCOF Adjudication
		appInfo.clickRelatedTab();
		Thread.sleep(5000);
		appInfo.clickCCFOSLink();
		Thread.sleep(5000);
		appInfo.clickCcfos();
		Thread.sleep(5000);

		CcofPage ccofInfo = new CcofPage(driver);
		ccofInfo.clickCcofAdjudicationLink();
		Thread.sleep(5000);
		utils.javaScriptExecutorAction(ccofInfo.clickNewApplicationIsSignedBtn());
		Thread.sleep(5000);
		utils.javaScriptExecutorAction(ccofInfo.clickApplicationFormAndLicenseSubmittedBtn());
		Thread.sleep(5000);
		utils.javaScriptExecutorAction(ccofInfo.clickLegalNameAndLicenseMatchBtn());
		Thread.sleep(5000);
		utils.javaScriptExecutorAction(ccofInfo.clickLicenseValidInHealthSpaceBtn());
		Thread.sleep(5000);
		utils.javaScriptExecutorAction(ccofInfo.clickMailingAddressInCasSupplierBtn());
		Thread.sleep(5000);
		utils.javaScriptExecutorAction(ccofInfo.clickProviderInGoodStandingBtn());
		Thread.sleep(5000);
		utils.javaScriptExecutorAction(ccofInfo.clickBasePayEligibleBtn());
		Thread.sleep(5000);
		utils.javaScriptExecutorAction(ccofInfo.clickBasePayActivatedBtn());
		Thread.sleep(5000);
		ccofInfo.clickSaveBtn();
		Thread.sleep(5000);
		ccofInfo.clickDashboardLink();
		Thread.sleep(5000);
		ccofInfo.clickBaseFundingProgressStatusField();
		Thread.sleep(5000);

		// selecting Confirmed - Active from dropdown
		utils.selectDropdownValue(utils.getDataFromJson("baseFundingProgressStatusOptions"),
				ccofInfo.getBaseFundingProgressStatusOptions());
		Thread.sleep(5000);
		ccofInfo.clickSaveAndCloseBtn();
		Thread.sleep(10000);
		appInfo.clickCcofTab();
		Thread.sleep(5000);

		// changing the CCOF status to Active
		appInfo.clickCcofStatus();
		Thread.sleep(5000);
		utils.selectDropdownValue(utils.getDataFromJson("ccofStatusOptions"), appInfo.getCcofStatusOptions());
		Thread.sleep(5000);
		appInfo.clickSaveBtn();
		Thread.sleep(5000);

		logger.info("Ending the AdjudicateApplicationCcof test...");

	}

}
