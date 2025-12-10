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

	@Test(priority = 1)
	public void adjudicateMTFICR(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "adjudicateMTFICR");
		logger.info("Starting the TestAdjudicateMTFIChangeRequest test...");

		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		Utilities ut = new Utilities(driver);

		// login to application
		Thread.sleep(3000);
		objCRMSignInCredentialPage.enterUserId(CRM_USERNAME);
		objCRMSignInCredentialPage.clickNext();
		ut.waitForElement(objCRMSignInCredentialPage.waitBeforePasswordEntered());
		objCRMSignInCredentialPage.enterPassword(CRM_PASSWORD);
		ut.waitForElement(objCRMSignInCredentialPage.waitBeforeClickSignIn());
		objCRMSignInCredentialPage.clickSignIn();
		Thread.sleep(3000);
		objCRMSignInCredentialPage.clickYes();
		ut.waitForElement(objCRMSignInCredentialPage.waitBeforeClickSignInAgain());
		objCRMSignInCredentialPage.clickSignInAgain();
		Thread.sleep(5000);
		objCRMSignInCredentialPage.switchToAppsDashboardIFrame();
		ut.waitForElement(objCRMSignInCredentialPage.waitBeforeClickOrgFacilities());
		objCRMSignInCredentialPage.clickOrgFacilities();
		Thread.sleep(3000);

		DeleteApplicationPage deleteapp = new DeleteApplicationPage(driver);

		// searching the contact
		deleteapp.searchBox(ut.getDataFromJson("contact"));
		Thread.sleep(5000);
		deleteapp.pressEnter();
		Thread.sleep(5000);
		deleteapp.fullName();
		Thread.sleep(3000);

		BCeIDPage bceidpage = new BCeIDPage(driver);
		bceidpage.clickSelectOrganization();

		OrganizationInfoPage orginfo = new OrganizationInfoPage(driver);

		// selecting the application
		ut.waitForElement(orginfo.waitBeforeClickMainApplication());
		orginfo.clickMainApplication();
		Thread.sleep(5000);

		ApplicationInfoPage appinfo = new ApplicationInfoPage(driver);

		// navigating to related tab
		appinfo.clickRelatedTab();

		// navigating to Change Requests in related Tab
		ut.waitForElement(appinfo.waitBeforeChangeRequests());
		appinfo.clickChangeRequests();

		// selecting the submitted MTFI Change Request
		ut.waitForElement(appinfo.waitBeforeClickChangeRequestSelected());
		appinfo.clickChangeRequestSelected();
		Thread.sleep(8000);

		ChangeRequestInfoPage changeRequestInfo = new ChangeRequestInfoPage(driver);

		// navigating to Change Request Adjudication tab
		ut.waitForElement(changeRequestInfo.waitBeforeClickChangeRequestAdjudicationTab());
		changeRequestInfo.clickChangeRequestAdjudicationTab();

		// clicking on Parent Fee Change(MTFI) Change Actions
		ut.waitForElement(changeRequestInfo.waitBeforeClickParentFeeMTFIChangeActions());
		changeRequestInfo.clickParentFeeMTFIChangeActions();
		Thread.sleep(5000);

		ChangeActionInfoPage changeActionInfo = new ChangeActionInfoPage(driver);

		// navigating to Parent Fee Change(MTFI) Change Action Page
		changeActionInfo.clickMTFIRow();

		ChangeActionMTFIInfoPage mtfiinfo = new ChangeActionMTFIInfoPage(driver);

		// entering MTFI decision tab and changing Adjudicator Recommendation and
		// MTFI-QC Decision
		ut.waitForElement(mtfiinfo.waitBeforeClickMTFIDecisionTab());
		mtfiinfo.clickMTFIDecisionTab();
		ut.waitForElement(mtfiinfo.waitBeforeClickClosureAdjudicatorRecommendationField());
		mtfiinfo.clickClosureAdjudicatorRecommendationField();
		Thread.sleep(5000);
		ut.selectDropdownValue(ut.getDataFromJson("closureAdjudicatorRecommendation"),
				mtfiinfo.getClosureAdjudicatorRecommendation());
		logger.info("Closure Adjudicator Recommendation option is selected");
		ut.waitForElement(mtfiinfo.waitBeforeClickAdjudicatorRecommendationField());
		mtfiinfo.clickAdjudicatorRecommendationField();
		Thread.sleep(5000);
		ut.selectDropdownValue(ut.getDataFromJson("adjudicatorRecommendation"),
				mtfiinfo.getAdjudicatorRecommendation());
		logger.info("Adjudicator Recommendation option is selected from Adjudicator Recommendation dropdown");
		ut.waitForElement(mtfiinfo.waitBeforeClickMTFIQCDecisionField());
		mtfiinfo.clickMTFIQCDecisionField();
		Thread.sleep(3000);
		ut.selectDropdownValue(ut.getDataFromJson("mtfiQCDecision"), mtfiinfo.getMTFIQCDecisionOptions());
		logger.info("MTFI-QC Decision option is selected from MTFI-QC Decision dropdown");
		ut.waitForElement(mtfiinfo.waitBeforeClickSaveButton());
		mtfiinfo.clickSaveButton();
		Thread.sleep(5000);
		mtfiinfo.clickExpandIcon();
		Thread.sleep(5000);
		mtfiinfo.clickStatusReasonField();
		Thread.sleep(5000);
		ut.selectDropdownValue(ut.getDataFromJson("mtfiStatusReasonOptions"), mtfiinfo.getStatusReasonOptions());
		Thread.sleep(5000);
		logger.info("Complete-Approved option is selected from MTFI Status dropdown");
		mtfiinfo.clickSaveAndCloseBtn();
		Thread.sleep(5000);
		logger.info("MTFI Change Action is saved and closed successfully");

		// saving and closing the Change Action Info Page
		changeActionInfo.clickSaveAndCloseBtn();
		Thread.sleep(5000);

		// changing Internal Status to Complete
		changeRequestInfo.clickMoreHeaderEditableFields();
		ut.waitForElement(changeRequestInfo.waitBeforeClickInternalStatusField());
		changeRequestInfo.clickInternalStatusField();
		Thread.sleep(5000);
		changeRequestInfo.mouseOverInternalStatusCompleteOption();
		ut.waitForElement(changeRequestInfo.waitBeforeClickSaveBtn());
		logger.info("Internal Status Complete option is selected from Internal Status dropdown");
		String internalstatus = changeRequestInfo.getInternalStatus();
		logger.info("Internal Status is: {}", internalstatus);
		changeRequestInfo.clickSaveBtn();
		Thread.sleep(5000);

		// validating the internal status and external status changed and are same
		changeRequestInfo.clickOverviewTab();
		ut.waitForElement(changeRequestInfo.waitForExternalStatusField());
		String externalstatus = changeRequestInfo.getExternalStatus();
		logger.info("External Status is: {}", externalstatus);

		// Assert they are equal
		ut.compareValues(internalstatus, externalstatus);

		logger.info("Ending the TestAdjudicateMTFIChangeRequest test...");

	}

}
