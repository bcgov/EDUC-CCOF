package ca.bc.gov.ecc.ccof.testcases;

import java.lang.reflect.Method;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.annotations.Test;

import ca.bc.gov.ecc.ccof.base.BaseTest;
import ca.bc.gov.ecc.ccof.extentreport.ExtentTestManager;
import ca.bc.gov.ecc.ccof.pageobjects.BCeIDPage;
import ca.bc.gov.ecc.ccof.pageobjects.CRMSignInCredentialPage;
import ca.bc.gov.ecc.ccof.pageobjects.DeleteApplicationPage;
import ca.bc.gov.ecc.ccof.pageobjects.FundingAgreementPage;
import ca.bc.gov.ecc.ccof.pageobjects.OrganizationInfoPage;
import ca.bc.gov.ecc.ccof.utils.Utilities;

public class TestAdjudicateApplicationFA extends BaseTest {

	private static final Logger logger = LogManager.getLogger(TestAdjudicateApplicationFA.class);

	@Test(priority = 1)
	public void adjudicateApplicationsFA(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "AdjudicateApplicationFA");
		logger.info("Starting the AdjudicateApplicationFA test...");

		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		Utilities utils = new Utilities(driver);

		// Login to CRM
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
		Thread.sleep(8000);

		DeleteApplicationPage deleteApp = new DeleteApplicationPage(driver);

		// Search contact
		deleteApp.searchBox(utils.getDataFromJson("contact"));
		Thread.sleep(5000);
		deleteApp.pressEnter();
		Thread.sleep(5000);
		deleteApp.fullName();
		Thread.sleep(5000);

		BCeIDPage bceidPage = new BCeIDPage(driver);

		// Switch to organization information page
		bceidPage.clickSelectOrganization();
		Thread.sleep(5000);

		OrganizationInfoPage orgInfo = new OrganizationInfoPage(driver);
		utils.scrollToElement(orgInfo.getOpenFundingAgreement());
		Thread.sleep(5000);

		// Open funding agreement and adjudicate
		orgInfo.clickFundingAgreement();
		Thread.sleep(5000);

		FundingAgreementPage faInfo = new FundingAgreementPage(driver);
		faInfo.enterStartDate(utils.getDataFromJson("fundingAgreementStartDate"));// date should be within an year from
																					// end
																					// date of FA
		Thread.sleep(2000);
		utils.javaScriptExecutorAction(faInfo.clickReadyForProviderAction());
		Thread.sleep(2000);
		faInfo.clickSaveAndClose();
		Thread.sleep(3000);

		// Change status to Drafted - with Ministry
		utils.scrollToElement(orgInfo.getOpenFundingAgreement());
		Thread.sleep(5000);
		orgInfo.clickFundingAgreement();
		Thread.sleep(5000);
		faInfo.clickExpandIcon();
		Thread.sleep(2000);
		faInfo.clickStatusReason();
		Thread.sleep(2000);
		utils.selectDropdownValue("Drafted - with Ministry", faInfo.getStatusReasonField());
		Thread.sleep(2000);
		faInfo.clickSaveAndClose();

		// Change status to Approved
		Thread.sleep(2000);
		utils.scrollToElement(orgInfo.getOpenFundingAgreement());
		Thread.sleep(5000);
		orgInfo.clickFundingAgreement();
		Thread.sleep(5000);
		faInfo.clickExpandIcon();
		Thread.sleep(2000);
		faInfo.clickStatusReason();
		Thread.sleep(2000);
		utils.selectDropdownValue("Approved", faInfo.getStatusReasonField());
		faInfo.clickSaveAndClose();
		Thread.sleep(2000);

		// Change status to Active
		utils.scrollToElement(orgInfo.getOpenFundingAgreement());
		Thread.sleep(5000);
		orgInfo.clickFundingAgreement();
		Thread.sleep(5000);
		faInfo.clickExpandIcon();
		Thread.sleep(2000);
		faInfo.clickStatusReason();
		Thread.sleep(2000);
		utils.selectDropdownValue("Active", faInfo.getStatusReasonField());
		faInfo.clickSaveAndClose();
		Thread.sleep(2000);

		logger.info("Ending the AdjudicateApplicationFA test...");

	}
}
