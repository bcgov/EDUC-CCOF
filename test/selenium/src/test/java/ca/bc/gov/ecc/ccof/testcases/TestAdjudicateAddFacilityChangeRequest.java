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
		Thread.sleep(5000);

		OrganizationInfoPage orginfo = new OrganizationInfoPage(driver);

		// selecting the application
		orginfo.clickMainApplication();
		Thread.sleep(5000);

		ApplicationInfoPage appinfo = new ApplicationInfoPage(driver);

		// navigating to related tab
		appinfo.clickRelatedTab();
		Thread.sleep(5000);

		// navigating to Change Requests in related Tab
		appinfo.clickChangeRequests();
		Thread.sleep(5000);
		// selecting the submitted Add new Facility Change Request
		appinfo.clickChangeRequestSelected();
		Thread.sleep(8000);

		ChangeRequestInfoPage changeRequestInfo = new ChangeRequestInfoPage(driver);

		// navigating to Change Request Adjudication tab
		changeRequestInfo.clickChangeRequestAdjudicationTab();
		Thread.sleep(5000);
		// clicking on Add New Facility Change Actions
		changeRequestInfo.clickAddNewFacilityChangeActions();
		Thread.sleep(5000);

		ChangeActionInfoPage changeActionInfo = new ChangeActionInfoPage(driver);

		// navigating to New Facility Change Action Page
		changeActionInfo.clickNewFacilityRow();
		Thread.sleep(5000);

		ChangeActionNewFacilityPage changeActionNewFacility = new ChangeActionNewFacilityPage(driver);
		// adjudicating Add Facility Change Request
		changeActionNewFacility.clickNewFacilityField();
		Thread.sleep(5000);

		FacilityInfoPage facilityinfo = new FacilityInfoPage(driver);

		// adding Facility ID
		facilityinfo.enterFacId(ut.generateDynamicValue("facilityId"));
		facilityinfo.clickMyCcsTestDropdown();
		Thread.sleep(5000);
		facilityinfo.clickFacilityStatusField();
		Thread.sleep(5000);
		facilityinfo.mouseOverCcfriComplete();
		Thread.sleep(5000);
		logger.info("CCFRI Complete option is selected from Facility Status dropdown");
		facilityinfo.clickSaveAndCloseCcfriFacilityBtn();
		Thread.sleep(5000);
		ut.clickIfPresent(facilityinfo.ignoreAndSaveButton());
		Thread.sleep(5000);

		// saving and closing the Add New Facility Change Action
		changeActionNewFacility.clickSaveAndCloseBtn();
		Thread.sleep(5000);

		// saving and closing the Change Action Info Page
		changeActionInfo.clickSaveAndCloseBtn();
		Thread.sleep(5000);

		// changing Internal Status to Complete
		changeRequestInfo.clickMoreHeaderEditableFields();
		Thread.sleep(3000);
		changeRequestInfo.clickInternalStatusField();
		Thread.sleep(5000);
		changeRequestInfo.mouseOverInternalStatusCompleteOption();
		Thread.sleep(5000);
		logger.info("Internal Status Complete option is selected from Internal Status dropdown");
		String internalstatus = changeRequestInfo.getInternalStatus();

		changeRequestInfo.clickSaveBtn();
		Thread.sleep(5000);
		changeRequestInfo.clickOverviewTab();
		Thread.sleep(5000);
		String externalstatus = changeRequestInfo.getExternalStatus();
		logger.info("External Status is: {}", externalstatus);

		// Assert they are equal
		ut.compareValues(internalstatus, externalstatus);

		logger.info("Ending the TestAdjudicateAddFacilityChangeRequest test...");

	}

}
