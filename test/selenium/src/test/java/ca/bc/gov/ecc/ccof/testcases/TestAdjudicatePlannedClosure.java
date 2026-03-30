package ca.bc.gov.ecc.ccof.testcases;

import java.lang.reflect.Method;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.Assert;
import org.testng.annotations.Test;

import ca.bc.gov.ecc.ccof.base.BaseTest;
import ca.bc.gov.ecc.ccof.extentreport.ExtentTestManager;
import ca.bc.gov.ecc.ccof.pageobjects.ClosurePage;
import ca.bc.gov.ecc.ccof.pageobjects.CRMSignInCredentialPage;
import ca.bc.gov.ecc.ccof.pageobjects.DeleteApplicationPage;
import ca.bc.gov.ecc.ccof.pageobjects.OrganizationInfoPage;
import ca.bc.gov.ecc.ccof.pageobjects.OrganizationOverviewPage;
import ca.bc.gov.ecc.ccof.pageobjects.BCeIDPage;
import ca.bc.gov.ecc.ccof.utils.Utilities;

public class TestAdjudicatePlannedClosure extends BaseTest {

	private static final Logger logger = LogManager.getLogger(TestAdjudicatePlannedClosure.class);
    String contactName;

	@Test(priority = 1)
	public void approveClosure(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "ApproveClosure");

		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		Utilities utils = new Utilities(driver);
        contactName = utils.getDataFromJson("contact");

		// load labels from test data
		String closureTypeLabel = utils.getDataFromJson("planned_closureType");
		String approvedAsLabel = utils.getDataFromJson("planned_approvedAs");
		String paymentEligibilityLabel = utils.getDataFromJson("paymentEligibility");
		String closureStatusLabel = utils.getDataFromJson("closureStatusOptions");

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
		Thread.sleep(3000);

        DeleteApplicationPage deleteApp = new DeleteApplicationPage(driver);

		// searching the contact
		deleteApp.searchAndOpenContact(contactName);
        Thread.sleep(3000);

        // switches view to organization
        BCeIDPage bceidPage = new BCeIDPage(driver);
        bceidPage.clickSelectOrganization();
        Thread.sleep(3000);

        // switches view to organization information page
        OrganizationOverviewPage orgOverview = new OrganizationOverviewPage(driver);
        orgOverview.clickOrgInformation();
        Thread.sleep(3000);

		OrganizationInfoPage orgInfo = new OrganizationInfoPage(driver);

        // click closures tab
		utils.waitForElement(orgInfo.waitBeforeClickClosuresTab());
		orgInfo.clickClosuresTab();
		Thread.sleep(3000);

        // double click into closures record
		utils.waitForElement(orgInfo.waitBeforeClickClosuresRecord());
		orgInfo.doubleClickClosuresRecord();
		Thread.sleep(5000);

		ClosurePage closurePage = new ClosurePage(driver);

        // set closure type to planned closure
        logger.info("Setting closure type to: " + closureTypeLabel);
		closurePage.clickClosureType();
		Thread.sleep(2000);
		utils.selectDropdownValue(closureTypeLabel, closurePage.getClosureTypeOptions());
		Thread.sleep(3000);

		// set approved as
		closurePage.clickApprovedAsField();
		Thread.sleep(2000);
		utils.selectDropdownValue(approvedAsLabel, closurePage.getApprovedAsOptions());
		Thread.sleep(3000);

		// set payment eligibility
		closurePage.clickPaymentEligibilityField();
		Thread.sleep(2000);
		utils.selectDropdownValue(paymentEligibilityLabel, closurePage.getPaymentEligibilityOptions());
		Thread.sleep(3000);

		// click the arrow dropdown to reveal closure status
		utils.waitForElement(closurePage.waitBeforeClickArrowDropdown());
		closurePage.clickArrowDropdown();
		Thread.sleep(2000);

		// set closure status to Complete - Approved
		closurePage.clickClosureStatusField();
		Thread.sleep(2000);
		utils.selectDropdownValue(closureStatusLabel, closurePage.getClosureStatusOptions());
		Thread.sleep(3000);

		// save the record
		closurePage.clickSaveBtn();
		Thread.sleep(5000);

		// verify the status shows COMPLETE - APPROVED
		utils.waitForElement(orgInfo.getCompletedApprovedStatus());
		Assert.assertTrue(orgInfo.getCompletedApprovedStatus().isDisplayed(), "Expected 'COMPLETE - APPROVED' status to be displayed after save.");
	}
}
