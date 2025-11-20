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
import ca.bc.gov.ecc.ccof.pageobjects.CcfrisInfoPage;
import ca.bc.gov.ecc.ccof.pageobjects.DeleteApplicationPage;
import ca.bc.gov.ecc.ccof.pageobjects.FacilityInfoPage;
import ca.bc.gov.ecc.ccof.pageobjects.OrganizationInfoPage;
import ca.bc.gov.ecc.ccof.utils.Utilities;

public class TestAdjudicateApplicationCcfri extends BaseTest {

	private static final Logger logger = LogManager.getLogger(TestAdjudicateApplicationCcfri.class);

	@Test(priority = 1)
	public void adjudicateApplications(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "AdjudicateApplicationCcfri");
		logger.info("Starting the AdjudicateApplicationCcfri  test...");

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
		Thread.sleep(3000);

		OrganizationInfoPage orginfo = new OrganizationInfoPage(driver);

		// selecting the application
		orginfo.clickMainApplication();
		Thread.sleep(5000);

		ApplicationInfoPage appinfo = new ApplicationInfoPage(driver);
		appinfo.clickDeclarationBStatus();
		ut.selectDropdownValue(ut.getDataFromJson("declarationBStatus"), appinfo.getDeclarationBStatusOptions());
		Thread.sleep(3000);
		appinfo.clickSaveBtn();
		Thread.sleep(3000);

		// navigating to related tab
		appinfo.clickRelatedTab();
		Thread.sleep(5000);

		// navigating to CCFRIs in related Tab
		appinfo.clickCCFRISLink();
		Thread.sleep(5000);
		appinfo.clickCcfri();
		Thread.sleep(5000);

		CcfrisInfoPage ccfriinfo = new CcfrisInfoPage(driver);

		// checking system recommendation inside Overview page of CCFRI
		String recommendation = ccfriinfo.getSystemRecommendation();
		logger.info("System Recommendation is: {}", recommendation);
		Thread.sleep(5000);
		ccfriinfo.clickCcfriFacilityAdjudicationTitle();
		Thread.sleep(8000);

		// selecting the facility and changing the status to CCFRI Complete
		ccfriinfo.clickOpenFacility();
		Thread.sleep(8000);

		FacilityInfoPage facilityinfo = new FacilityInfoPage(driver);
		facilityinfo.clickFacilityNameLink();
		Thread.sleep(5000);
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

		// entering initial decision tab and changing ccfri recommendation and QC
		facilityinfo.clickInitialDecisionLink();
		Thread.sleep(5000);
		facilityinfo.clickCcfriRecommendationField();
		Thread.sleep(5000);
		ut.selectDropdownValue(ut.getDataFromJson("ccfriAdjudicatorRecommendation"),
				facilityinfo.getCCFRIAdjudicatorRecommendation());
		Thread.sleep(5000);
		facilityinfo.switchToCcfriStartDateIFrame();
		ut = new Utilities(driver);
		ut.selectvalue(facilityinfo.getCCFRIPaymentEligibilityStartDate(),
				ut.getDataFromJson("ccfriPaymentEligibilityStartDate"));
		Thread.sleep(2000);
		facilityinfo.switchToDefaultContent();
		Thread.sleep(5000);
		facilityinfo.clickCcfriQcDecisionField();
		Thread.sleep(5000);
		ut.selectDropdownValue(ut.getDataFromJson("ccfriQcDecision"), facilityinfo.getCCFRIQCDecision());
		Thread.sleep(5000);
		facilityinfo.clickSaveBtn();
		Thread.sleep(5000);
		facilityinfo.clickExpandIcon();
		Thread.sleep(5000);
		facilityinfo.clickCcfriStatusField();
		Thread.sleep(5000);
		ut.selectDropdownValue(ut.getDataFromJson("ccfriStatusOptions"), facilityinfo.getCcfriStatusOptions());
		Thread.sleep(5000);
		logger.info("Complete-Approved option is selected from CCFRI Status dropdown");
		facilityinfo.clickSaveAndCloseCcfriFacilityBtn();
		Thread.sleep(5000);
		ccfriinfo.clickSaveAndCloseBtn();
		Thread.sleep(5000);

		logger.info("Ending the AdjudicateApplicationCcfri  test...");

	}

}