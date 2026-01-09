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

public class TestEfxAdjudicateRenewalCcfri extends BaseTest {

	private static final Logger logger = LogManager.getLogger(TestEfxAdjudicateRenewalCcfri.class);
	String contactName;

	@Test(priority = 1)
	public void adjudicateRenewalsEfx(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "AdjudicateRenewalCcfriEfx");
		logger.info("Starting the AdjudicateRenewalFullCcfriEfx  test...");

		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		Utilities utils = new Utilities(driver);
		contactName = utils.getDataFromJson("contact");

		// login to application
		utils.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforeEnterUserId());
		objCRMSignInCredentialPage.enterUserId(CRM_USERNAME);
		objCRMSignInCredentialPage.clickNext();
		utils.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforePasswordEntered());
		objCRMSignInCredentialPage.enterPassword(CRM_PASSWORD);
		utils.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforeClickSignIn());
		objCRMSignInCredentialPage.clickSignIn();
		utils.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforeClickYes());
		objCRMSignInCredentialPage.clickYes();
		utils.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforeClickSignInAgain());
		objCRMSignInCredentialPage.clickSignInAgain();
		Thread.sleep(5000);
		objCRMSignInCredentialPage.switchToAppsDashboardIFrame();
		utils.waitForElementToLoad(objCRMSignInCredentialPage.waitBeforeClickOrgFacilities());
		objCRMSignInCredentialPage.clickOrgFacilities();
		Thread.sleep(3000);

		DeleteApplicationPage deleteApp = new DeleteApplicationPage(driver);

		// searching the contact
		deleteApp.searchAndOpenContact(contactName);

		BCeIDPage bceidPage = new BCeIDPage(driver);
		bceidPage.clickSelectOrganization();
		Thread.sleep(3000);

		OrganizationInfoPage orgInfo = new OrganizationInfoPage(driver);

		// adding Organization ID
		orgInfo.enterOrgId(utils.generateDynamicValue("organizationId"));
		Thread.sleep(3000);
		orgInfo.clickSaveBtn();
		Thread.sleep(5000);
		utils.clickIfPresent(orgInfo.ignoreAndSaveButton());
		Thread.sleep(3000);

		// selecting the application
		orgInfo.clickRenewalApplication();
		Thread.sleep(5000);

		ApplicationInfoPage appInfo = new ApplicationInfoPage(driver);
		appInfo.clickDeclarationBStatus();
		utils.selectDropdownValue(utils.getDataFromJson("declarationBStatus"), appInfo.getDeclarationBStatusOptions());
		Thread.sleep(3000);

		// navigating to related tab
		appInfo.clickRelatedTab();
		Thread.sleep(5000);

		// navigating to CCFRIs in related Tab
		appInfo.clickCCFRISLink();
		Thread.sleep(5000);
		appInfo.clickCcfri();
		Thread.sleep(5000);

		CcfrisInfoPage ccfriInfo = new CcfrisInfoPage(driver);

		// checking system recommendation inside Overview page of CCFRI
		String recommendation = ccfriInfo.getSystemRecommendation();
		logger.info("System Recommendation is: {}", recommendation);
		Thread.sleep(5000);
		ccfriInfo.clickCcfriFacilityAdjudicationTitle();
		Thread.sleep(5000);

		// selecting the facility and changing the status to CCFRI Complete
		ccfriInfo.clickOpenSubmittedFacility();
		Thread.sleep(5000);

		FacilityInfoPage facilityInfo = new FacilityInfoPage(driver);
		facilityInfo.clickFacilityNameLink();

		// adding Facility ID
		facilityInfo.enterFacId(utils.generateDynamicValue("facilityId"));

		Thread.sleep(5000);
		facilityInfo.clickMyCcsTestDropdown();
		Thread.sleep(5000);
		facilityInfo.clickFacilityStatusField();
		Thread.sleep(5000);
		facilityInfo.mouseOverCcfriComplete();
		Thread.sleep(5000);
		logger.info("CCFRI Complete option is selected from Facility Status dropdown");
		facilityInfo.clickSaveAndCloseCcfriFacilityBtn();
		Thread.sleep(5000);
		utils.clickIfPresent(facilityInfo.ignoreAndSaveButton());
		Thread.sleep(3000);

		// entering initial decision tab and changing ccfri recommendation and QC
		facilityInfo.clickInitialDecisionLink();
		Thread.sleep(5000);
		facilityInfo.clickCcfriRecommendationField();
		Thread.sleep(5000);
		utils.selectDropdownValue(utils.getDataFromJson("ccfriAdjudicatorRecommendation"),
				facilityInfo.getCCFRIAdjudicatorRecommendation());
		Thread.sleep(5000);
		facilityInfo.switchToCcfriStartDateIFrame();
		utils = new Utilities(driver);
		utils.selectvalue(facilityInfo.getCCFRIPaymentEligibilityStartDate(),
				utils.getDataFromJson("ccfriPaymentEligibilityStartDate"));
		Thread.sleep(2000);
		facilityInfo.switchToDefaultContent();
		Thread.sleep(5000);
		facilityInfo.clickCcfriQcDecisionField();
		Thread.sleep(5000);
		utils.selectDropdownValue(utils.getDataFromJson("ccfriQcDecision"), facilityInfo.getCCFRIQCDecision());
		Thread.sleep(5000);
		facilityInfo.clickSaveBtn();
		Thread.sleep(5000);
		facilityInfo.clickExpandIcon();
		Thread.sleep(5000);
		facilityInfo.clickCcfriStatusField();
		Thread.sleep(5000);
		utils.selectDropdownValue(utils.getDataFromJson("ccfriStatusOptions"), facilityInfo.getCcfriStatusOptions());
		Thread.sleep(5000);
		logger.info("Complete-Approved option is selected from CCFRI Status dropdown");
		facilityInfo.clickSaveAndCloseCcfriFacilityBtn();
		Thread.sleep(5000);
		ccfriInfo.clickSaveAndCloseBtn();
		Thread.sleep(5000);

		logger.info("Ending the EfxAdjudicateRenewalCcfriTest  test...");

	}

}
