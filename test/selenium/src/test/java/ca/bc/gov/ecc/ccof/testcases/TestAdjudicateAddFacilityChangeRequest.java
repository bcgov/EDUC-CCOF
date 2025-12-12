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
import ca.bc.gov.ecc.ccof.pageobjects.ChangeActionNewFacilityPage;
import ca.bc.gov.ecc.ccof.pageobjects.ChangeRequestInfoPage;
import ca.bc.gov.ecc.ccof.pageobjects.DeleteApplicationPage;
import ca.bc.gov.ecc.ccof.pageobjects.FacilityInfoPage;
import ca.bc.gov.ecc.ccof.pageobjects.OrganizationInfoPage;
import ca.bc.gov.ecc.ccof.utils.Utilities;

public class TestAdjudicateAddFacilityChangeRequest extends BaseTest {

	private static final Logger logger = LogManager.getLogger(TestAdjudicateAddFacilityChangeRequest.class);

	@Test(priority = 1)
	public void adjudicateAddFacilityCR(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "adjudicateAddFacilityCR");
		logger.info("Starting the TestAdjudicateAddFacilityChangeRequest test...");

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
		Thread.sleep(3000);
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
		deleteApp.searchBox(utils.getDataFromJson("contact"));
		Thread.sleep(5000);
		deleteApp.pressEnter();
		Thread.sleep(5000);
		deleteApp.fullName();
		Thread.sleep(3000);

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

		// selecting the submitted Add new Facility Change Request
		utils.waitForElement(appInfo.waitBeforeClickChangeRequestSelected());
		appInfo.clickChangeRequestSelected();

		ChangeRequestInfoPage changeRequestInfo = new ChangeRequestInfoPage(driver);

		// navigating to Change Request Adjudication tab
		utils.waitForElement(changeRequestInfo.waitBeforeClickChangeRequestAdjudicationTab());
		changeRequestInfo.clickChangeRequestAdjudicationTab();

		// clicking on Add New Facility Change Actions
		utils.waitForElement(changeRequestInfo.waitBeforeClickAddNewFacilityChangeActions());
		changeRequestInfo.clickAddNewFacilityChangeActions();
		Thread.sleep(5000);

		ChangeActionInfoPage changeActionInfo = new ChangeActionInfoPage(driver);

		// navigating to New Facility Change Action Page
		changeActionInfo.clickNewFacilityRow();

		ChangeActionNewFacilityPage changeActionNewFacility = new ChangeActionNewFacilityPage(driver);

		// adjudicating Add Facility Change Request
		utils.waitForElement(changeActionNewFacility.waitBeforeClickNewFacilityField());
		changeActionNewFacility.clickNewFacilityField();
		Thread.sleep(5000);

		FacilityInfoPage facilityInfo = new FacilityInfoPage(driver);

		// adding Facility ID
		facilityInfo.enterFacId(utils.generateDynamicValue("facilityId"));
		facilityInfo.clickMyCcsTestDropdown();

		// changing Facility Status to CCFRI Complete
		utils.waitForElement(facilityInfo.waitBeforeClickFacilityStatusField());
		facilityInfo.clickFacilityStatusField();
		Thread.sleep(5000);
		facilityInfo.mouseOverCcfriComplete();
		logger.info("CCFRI Complete option is selected from Facility Status dropdown");
		utils.waitForElement(facilityInfo.waitBeforeClickSaveAndCloseCcfriFacilityBtn());
		facilityInfo.clickSaveAndCloseCcfriFacilityBtn();
		Thread.sleep(5000);
		utils.clickIfPresent(facilityInfo.ignoreAndSaveButton());
		Thread.sleep(5000);

		// saving and closing the Add New Facility Change Action
		changeActionNewFacility.clickSaveAndCloseBtn();
		Thread.sleep(5000);

		// saving and closing the Change Action Info Page
		changeActionInfo.clickSaveAndCloseBtn();
		Thread.sleep(5000);

		// changing Internal Status to Complete
		changeRequestInfo.clickMoreHeaderEditableFields();
		utils.waitForElement(changeRequestInfo.waitBeforeClickInternalStatusField());
		changeRequestInfo.clickInternalStatusField();
		utils.waitForElement(changeRequestInfo.waitBeforeClickInternalStatusCompleteOption());
		changeRequestInfo.mouseOverInternalStatusCompleteOption();
		utils.waitForElement(changeRequestInfo.waitBeforeClickSaveBtn());
		logger.info("Internal Status Complete option is selected from Internal Status dropdown");
		String internalstatus = changeRequestInfo.getInternalStatus();
		changeRequestInfo.clickSaveBtn();
		Thread.sleep(5000);
		changeRequestInfo.clickOverviewTab();

		// getting External Status value
		utils.waitForElement(changeRequestInfo.waitForExternalStatusField());
		String externalstatus = changeRequestInfo.getExternalStatus();
		logger.info("External Status is: {}", externalstatus);

		// Assert they are equal
		utils.compareValues(internalstatus, externalstatus);

		logger.info("Ending the TestAdjudicateAddFacilityChangeRequest test...");

	}

}
