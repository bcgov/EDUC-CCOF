package ca.bc.gov.ecc.ccof.testcases;

import java.lang.reflect.Method;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.annotations.Test;

import ca.bc.gov.ecc.ccof.baseclass.BaseTest;
import ca.bc.gov.ecc.ccof.extentreport.ExtentTestManager;
import ca.bc.gov.ecc.ccof.pageobjects.ApplicationInfoPage;
import ca.bc.gov.ecc.ccof.pageobjects.BCeIDPage;
import ca.bc.gov.ecc.ccof.pageobjects.CRMSignInCredentialPage;
import ca.bc.gov.ecc.ccof.pageobjects.CcfrisInfoPage;
import ca.bc.gov.ecc.ccof.pageobjects.DeleteApplicationPage;
import ca.bc.gov.ecc.ccof.pageobjects.FacilityInfoPage;
import ca.bc.gov.ecc.ccof.pageobjects.OrganizationInfoPage;
import ca.bc.gov.ecc.ccof.utils.utlities;

public class AdjudicateGroupApplicationCcfri extends BaseTest {

	private static final Logger logger = LogManager.getLogger(AdjudicateGroupApplicationCcfri.class);

	@Test(priority = 1)
	public void AdjudicateGroupApplications(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "AdjudicateGroupApplicationCcfri");
		logger.info("Starting the AdjudicateGroupApplicationCcfri  test...");
		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		objCRMSignInCredentialPage.signInApplication();
		Thread.sleep(5000);
		objCRMSignInCredentialPage.clickOrgFacilities();
		Thread.sleep(3000);
		DeleteApplicationPage deleteapp = new DeleteApplicationPage(driver);
		deleteapp.searchBox("QA218 OFM");
		Thread.sleep(3000);
		deleteapp.pressEnter();
		Thread.sleep(3000);
		deleteapp.fullName();
		Thread.sleep(3000);
		BCeIDPage bceidpage = new BCeIDPage(driver);
		bceidpage.clickSelectOrganization();
		Thread.sleep(3000);
		OrganizationInfoPage orginfo = new OrganizationInfoPage(driver);
		orginfo.clickApplication();
		Thread.sleep(5000);
		ApplicationInfoPage appinfo = new ApplicationInfoPage(driver);
		appinfo.clickRelatedTab();
		Thread.sleep(5000);
		appinfo.clickCCFRISLink();
		Thread.sleep(5000);
		appinfo.clickCcfri();
		Thread.sleep(5000);
		CcfrisInfoPage ccfriinfo = new CcfrisInfoPage(driver);
		String recommendation = ccfriinfo.getSystemRecommendation();
		System.out.println("System Recommendation is: " + recommendation);
		logger.info("System Recommendation is printed in console");
		Thread.sleep(5000);
		ccfriinfo.clickCcfriFacilityAdjudicationTitle();
		Thread.sleep(5000);
		ccfriinfo.clickOpenFacility();
		Thread.sleep(5000);
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
		facilityinfo.clickIgnoreAndSaveIfPresent();
		facilityinfo.clickInitialDecisionLink();
		Thread.sleep(5000);
		facilityinfo.clickCcfriRecommendationField();
		Thread.sleep(5000);
		facilityinfo.getCCFRIAdjudicatorRecommendation("Stage 1 (NRC)");
		Thread.sleep(5000);
		facilityinfo.switchToCcfriStartDateIFrame();
		utlities ut = new utlities(driver);
		ut.selectvalue(facilityinfo.getCCFRIPaymentEligibilityStartDate(), "Jul");
		Thread.sleep(2000);
		facilityinfo.switchToDefaultContent();
		Thread.sleep(5000);
		facilityinfo.clickCcfriQcDecisionField();
		Thread.sleep(5000);
		facilityinfo.getCCFRIQCDecision("Stage 1 (NRC)");
		Thread.sleep(5000);
		facilityinfo.clickSaveBtn();
		Thread.sleep(5000);
		facilityinfo.clickExpandIcon();
		Thread.sleep(5000);
		facilityinfo.clickCcfriStatusField();
		Thread.sleep(5000);
		facilityinfo.getCcfriStatusOptions("Complete - Approved");
		Thread.sleep(5000);
		logger.info("Complete-Approved option is selected from CCFRI Status dropdown");
		facilityinfo.clickSaveAndCloseCcfriFacilityBtn();
		Thread.sleep(5000);
		ccfriinfo.clickSaveAndCloseBtn();
		Thread.sleep(5000);

		logger.info("Ending the AdjudicateGroupApplicationCcfri  test...");

	}

}