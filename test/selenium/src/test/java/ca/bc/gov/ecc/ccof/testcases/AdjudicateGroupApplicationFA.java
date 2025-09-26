package ca.bc.gov.ecc.ccof.testcases;

import java.lang.reflect.Method;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.annotations.Test;

import ca.bc.gov.ecc.ccof.baseclass.BaseTest;
import ca.bc.gov.ecc.ccof.extentreport.ExtentTestManager;
import ca.bc.gov.ecc.ccof.pageobjects.BCeIDPage;
import ca.bc.gov.ecc.ccof.pageobjects.CRMSignInCredentialPage;
import ca.bc.gov.ecc.ccof.pageobjects.DeleteApplicationPage;
import ca.bc.gov.ecc.ccof.pageobjects.FundingAgreementPage;
import ca.bc.gov.ecc.ccof.pageobjects.OrganizationInfoPage;
import ca.bc.gov.ecc.ccof.utils.utlities;

public class AdjudicateGroupApplicationFA extends BaseTest {

	private static final Logger logger = LogManager.getLogger(AdjudicateGroupApplicationFA.class);

	@Test(priority = 1)
	public void AdjudicateGroupApplicationsFA(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "AdjudicateGroupApplicationFA");
		logger.info("Starting the AdjudicateGroupApplicationFA test...");
		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		objCRMSignInCredentialPage.signInApplication();
		Thread.sleep(8000);
		objCRMSignInCredentialPage.clickOrgFacilities();
		Thread.sleep(8000);
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
		utlities ut = new utlities(driver);
		ut.scrollToElement(orginfo.getOpenFundingAgreement());
		Thread.sleep(5000);
		orginfo.clickFundingAgreement();
		Thread.sleep(5000);
		FundingAgreementPage fainfo = new FundingAgreementPage(driver);
		fainfo.enterStartDate("04/01/2025");// date should be within an year from end date of FA
		Thread.sleep(2000);
		fainfo.clickReadyForProviderAction();
		Thread.sleep(2000);
		fainfo.clickSaveAndClose();
		Thread.sleep(3000);
		ut.scrollToElement(orginfo.getOpenFundingAgreement());
		Thread.sleep(5000);
		orginfo.clickFundingAgreement();
		Thread.sleep(5000);
		fainfo.clickExpandIcon();
		Thread.sleep(2000);
		fainfo.clickStatusReason();
		Thread.sleep(2000);
		fainfo.getStatusReasonOptions("Drafted - with Ministry");
		Thread.sleep(2000);
		fainfo.clickSaveAndClose();
		ut.scrollToElement(orginfo.getOpenFundingAgreement());
		Thread.sleep(5000);
		orginfo.clickFundingAgreement();
		Thread.sleep(5000);
		fainfo.clickExpandIcon();
		Thread.sleep(2000);
		fainfo.clickStatusReason();
		Thread.sleep(2000);
		fainfo.getStatusReasonOptions("Active");
		fainfo.clickSaveAndClose();

		logger.info("Ending the AdjudicateGroupApplicationFA test...");

	}
}
