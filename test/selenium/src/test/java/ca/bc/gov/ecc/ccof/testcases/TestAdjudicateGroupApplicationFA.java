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

public class TestAdjudicateGroupApplicationFA extends BaseTest {

	private static final Logger logger = LogManager.getLogger(TestAdjudicateGroupApplicationFA.class);

	Utilities ut;

	@Test(priority = 1)
	public void adjudicateGroupApplicationsFA(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "AdjudicateGroupApplicationFA");
		logger.info("Starting the AdjudicateGroupApplicationFA test...");
		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		ut = new Utilities(driver);
		// Login to CRM
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
		Thread.sleep(8000);
		DeleteApplicationPage deleteapp = new DeleteApplicationPage(driver);
		// Search contact
		deleteapp.searchBox("QA218 OFM");
		Thread.sleep(5000);
		deleteapp.pressEnter();
		Thread.sleep(5000);
		deleteapp.fullName();
		Thread.sleep(5000);
		BCeIDPage bceidpage = new BCeIDPage(driver);
		// Switch to organization information page
		bceidpage.clickSelectOrganization();
		Thread.sleep(5000);
		OrganizationInfoPage orginfo = new OrganizationInfoPage(driver);
		ut.scrollToElement(orginfo.getOpenFundingAgreement());
		Thread.sleep(5000);
		// Open funding agreement and adjudicate
		orginfo.clickFundingAgreement();
		Thread.sleep(5000);
		FundingAgreementPage fainfo = new FundingAgreementPage(driver);
		fainfo.enterStartDate("04/01/2025");// date should be within an year from end date of FA
		Thread.sleep(2000);
		ut.javaScriptExecutorAction(fainfo.clickReadyForProviderAction());
		Thread.sleep(2000);
		fainfo.clickSaveAndClose();
		Thread.sleep(3000);
		// Change status to Drafted - with Ministry
		ut.scrollToElement(orginfo.getOpenFundingAgreement());
		Thread.sleep(5000);
		orginfo.clickFundingAgreement();
		Thread.sleep(5000);
		fainfo.clickExpandIcon();
		Thread.sleep(2000);
		fainfo.clickStatusReason();
		Thread.sleep(2000);
		ut.selectDropdownValue("Drafted - with Ministry", fainfo.getStatusReasonField());
		Thread.sleep(2000);
		fainfo.clickSaveAndClose();
		// Change status to Active
		ut.scrollToElement(orginfo.getOpenFundingAgreement());
		Thread.sleep(5000);
		orginfo.clickFundingAgreement();
		Thread.sleep(5000);
		fainfo.clickExpandIcon();
		Thread.sleep(2000);
		fainfo.clickStatusReason();
		Thread.sleep(2000);
		ut.selectDropdownValue("Active", fainfo.getStatusReasonField());
		fainfo.clickSaveAndClose();

		logger.info("Ending the AdjudicateGroupApplicationFA test...");

	}
}
