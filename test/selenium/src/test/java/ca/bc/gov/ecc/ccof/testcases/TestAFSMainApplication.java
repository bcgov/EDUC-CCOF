package ca.bc.gov.ecc.ccof.testcases;

import java.lang.reflect.Method;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.testng.annotations.Test;

import ca.bc.gov.ecc.ccof.base.BaseTest;
import ca.bc.gov.ecc.ccof.extentreport.ExtentTestManager;
import ca.bc.gov.ecc.ccof.pageobjects.ApplicationInfoPage;
import ca.bc.gov.ecc.ccof.pageobjects.ApprovableFeeSchedulePage;
import ca.bc.gov.ecc.ccof.pageobjects.BCeIDPage;
import ca.bc.gov.ecc.ccof.pageobjects.CRMSignInCredentialPage;
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
		Thread.sleep(8000);
		facilityInfo.clickCcfriRecommendationField();

		List<WebElement> litsIframe = driver.findElements(By.tagName("iframe"));
		logger.info("Total iframes are: " + litsIframe.size());
		// scrolling down the page
		for (int i = 1; i < litsIframe.size(); i++) {

			driver.switchTo().frame(i);
			System.out.println("Switched to iframe " + i);

			JavascriptExecutor js = (JavascriptExecutor) driver;
			js.executeScript("window.scrollTo(0, document.body.scrollHeight);");

		}

		Actions action = new Actions(driver);
		action.sendKeys(Keys.PAGE_DOWN).build().perform();
		action.sendKeys(Keys.PAGE_DOWN).build().perform();
		action.sendKeys(Keys.PAGE_DOWN).build().perform();
		action.sendKeys(Keys.PAGE_DOWN).build().perform();
		Thread.sleep(8000);

		facilityInfo.clickSelectApprovableFeeScheduleCheckbox();
		Thread.sleep(3000);

		// approval fee schedule page and edit the fee

		ApprovableFeeSchedulePage approvalFeeScheduleInfo = new ApprovableFeeSchedulePage(driver);
		utils.clearAndType(approvalFeeScheduleInfo.enterAprFee(), utils.getDataFromJson("afsaprfee"));
		Thread.sleep(3000);

		logger.info("Ending the AdjudicateApplicationCcfri  test...");
	}
}
