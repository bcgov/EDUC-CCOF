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
import ca.bc.gov.ecc.ccof.pageobjects.ChangeActionInfoPage;
import ca.bc.gov.ecc.ccof.pageobjects.ChangeActionMTFIInfoPage;
import ca.bc.gov.ecc.ccof.pageobjects.ChangeRequestInfoPage;
import ca.bc.gov.ecc.ccof.pageobjects.DeleteApplicationPage;
import ca.bc.gov.ecc.ccof.pageobjects.OrganizationInfoPage;
import ca.bc.gov.ecc.ccof.utils.Utilities;

public class TestAdjudicateMTFIChangeRequest extends BaseTest {

	private static final Logger logger = LogManager.getLogger(TestAdjudicateMTFIChangeRequest.class);
	String contactName;

	@Test(priority = 1)
	public void adjudicateMTFICR(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "adjudicateMTFICR");
		logger.info("Starting the TestAdjudicateMTFIChangeRequest test...");

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

		OrganizationInfoPage orgInfo = new OrganizationInfoPage(driver);

		// selecting the application
		utils.waitForElement(orgInfo.waitBeforeClickMainApplication());
		orgInfo.clickMainApplication();
		Thread.sleep(5000);

		ApplicationInfoPage appInfo = new ApplicationInfoPage(driver);

		// navigating to related tab
		appInfo.clickRelatedTab();

		// navigating to Change Requests in related Tab
		utils.waitForElement(appInfo.waitBeforeChangeRequests());
		appInfo.clickChangeRequests();

		// selecting the submitted MTFI Change Request
		utils.waitForElement(appInfo.waitBeforeClickChangeRequestSelected());
		appInfo.clickChangeRequestSelected();
		Thread.sleep(8000);

		ChangeRequestInfoPage changeRequestInfo = new ChangeRequestInfoPage(driver);

		// navigating to Change Request Adjudication tab
		utils.waitForElement(changeRequestInfo.waitBeforeClickChangeRequestAdjudicationTab());
		changeRequestInfo.clickChangeRequestAdjudicationTab();

		// clicking on Parent Fee Change(MTFI) Change Actions
		utils.waitForElement(changeRequestInfo.waitBeforeClickParentFeeMTFIChangeActions());
		changeRequestInfo.clickParentFeeMTFIChangeActions();
		Thread.sleep(5000);

		ChangeActionInfoPage changeActionInfo = new ChangeActionInfoPage(driver);

		// navigating to Parent Fee Change(MTFI) Change Action Page
		changeActionInfo.clickMTFIRow();

		ChangeActionMTFIInfoPage mtfiInfo = new ChangeActionMTFIInfoPage(driver);

		// entering MTFI decision tab and changing Adjudicator Recommendation and
		// MTFI-QC Decision
		utils.waitForElement(mtfiInfo.waitBeforeClickMTFIDecisionTab());
		mtfiInfo.clickMTFIDecisionTab();
		utils.waitForElement(mtfiInfo.waitBeforeClickClosureAdjudicatorRecommendationField());
		mtfiInfo.clickClosureAdjudicatorRecommendationField();
		Thread.sleep(5000);
		utils.selectDropdownValue(utils.getDataFromJson("closureAdjudicatorRecommendation"),
				mtfiInfo.getClosureAdjudicatorRecommendation());
		logger.info("Closure Adjudicator Recommendation option is selected");
		utils.waitForElement(mtfiInfo.waitBeforeClickAdjudicatorRecommendationField());
		mtfiInfo.clickAdjudicatorRecommendationField();
		Thread.sleep(5000);
		utils.selectDropdownValue(utils.getDataFromJson("adjudicatorRecommendation"),
				mtfiInfo.getAdjudicatorRecommendation());
		logger.info("Adjudicator Recommendation option is selected from Adjudicator Recommendation dropdown");
		utils.waitForElement(mtfiInfo.waitBeforeClickMTFIQCDecisionField());
		mtfiInfo.clickMTFIQCDecisionField();
		Thread.sleep(3000);
		utils.selectDropdownValue(utils.getDataFromJson("mtfiQCDecision"), mtfiInfo.getMTFIQCDecisionOptions());
		logger.info("MTFI-QC Decision option is selected from MTFI-QC Decision dropdown");
		utils.waitForElement(mtfiInfo.waitBeforeClickSaveButton());
		mtfiInfo.clickSaveButton();
		Thread.sleep(5000);
		mtfiInfo.clickExpandIcon();
		Thread.sleep(5000);
		mtfiInfo.clickStatusReasonField();
		Thread.sleep(5000);
		utils.selectDropdownValue(utils.getDataFromJson("mtfiStatusReasonOptions"), mtfiInfo.getStatusReasonOptions());
		Thread.sleep(5000);
		logger.info("Complete-Approved option is selected from MTFI Status dropdown");
		mtfiInfo.clickSaveAndCloseBtn();
		Thread.sleep(5000);
		logger.info("MTFI Change Action is saved and closed successfully");

		// saving and closing the Change Action Info Page
		changeActionInfo.clickSaveAndCloseBtn();
		Thread.sleep(5000);

		// changing Internal Status to Complete
		changeRequestInfo.clickMoreHeaderEditableFields();
		utils.waitForElement(changeRequestInfo.waitBeforeClickInternalStatusField());
		changeRequestInfo.clickInternalStatusField();
		Thread.sleep(5000);
		changeRequestInfo.mouseOverInternalStatusCompleteOption();
		utils.waitForElement(changeRequestInfo.waitBeforeClickSaveBtn());
		logger.info("Internal Status Complete option is selected from Internal Status dropdown");
		String internalstatus = changeRequestInfo.getInternalStatus();
		logger.info("Internal Status is: {}", internalstatus);
		changeRequestInfo.clickSaveBtn();
		Thread.sleep(5000);

		// validating the internal status and external status changed and are same
		changeRequestInfo.clickOverviewTab();
		utils.waitForElement(changeRequestInfo.waitForExternalStatusField());
		String externalstatus = changeRequestInfo.getExternalStatus();
		logger.info("External Status is: {}", externalstatus);

		// Assert they are equal
		utils.compareValues(internalstatus, externalstatus);

		logger.info("Ending the TestAdjudicateMTFIChangeRequest test...");

	}

}
