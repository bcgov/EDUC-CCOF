package ca.bc.gov.ecc.ccof.testcases;

import java.lang.reflect.Method;
import java.time.Duration;

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
import ca.bc.gov.ecc.ccof.pageobjects.FacilityInfoPage;
import ca.bc.gov.ecc.ccof.pageobjects.OrganizationInfoPage;
import ca.bc.gov.ecc.ccof.utils.Utilities;

public class TestAFSMainApplication extends BaseTest {

	private static final Logger logger = LogManager.getLogger(TestAFSMainApplication.class);
	String contactName;

	@Test(priority = 1)
	public void adjudicateAFSApplications(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "AdjudicateApplicationAFS");
		logger.info("Starting the TestAFSMainApplication test...");

		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		Utilities utils = new Utilities(driver);
		contactName = utils.getDataFromJson("contact");

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

		// clicking on facility adjudication title
		ccfriInfo.clickCcfriFacilityAdjudicationTitle();
		Thread.sleep(8000);
		ccfriInfo.clickOpenCompleteApprovedFacility();
		Thread.sleep(8000);

		FacilityInfoPage facilityInfo = new FacilityInfoPage(driver);
		facilityInfo.clickInitialDecisionLink();
		Thread.sleep(5000);

		// toggle on the AFS Confirmed
		boolean afsOK = facilityInfo.setAfsConfirmedViaXrm(true);
		logger.info("AFS Confirmed set via Xrm: {}", afsOK);
		if (!afsOK) {
			facilityInfo.clickAfsConfirmedToggle(Duration.ofSeconds(10));
		}

		facilityInfo.clickSaveAndCloseCcfriFacilityBtn();
		Thread.sleep(8000);
		ccfriInfo.clickUnlockBtn();
		Thread.sleep(8000);

		// validate the AFS Enable and Unlock status in unlock form
		CcfriUnlockForm ccfriUnlock = new CcfriUnlockForm(driver);
		utils.compareValues("Enabled", ccfriUnlock.actualAfsEnableStatusTxt());
		utils.compareValues("Unlocked", ccfriUnlock.actualAfsUnlockStatusTxt());

		logger.info("AFS Application adjudicated successfully.");

		logger.info("Ending the TestAFSMainApplication  test...");
	}
}
