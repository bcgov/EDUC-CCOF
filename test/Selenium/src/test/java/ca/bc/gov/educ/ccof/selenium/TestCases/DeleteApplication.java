package ca.bc.gov.educ.ccof.selenium.TestCases;

import java.lang.reflect.Method;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.annotations.Test;

import ExtentReport.ExtentTestManager;
import baseclass.BaseTest;
import ca.bc.gov.educ.ccof.selenium.PageObjects.CRMSignInCredentialPage;
import ca.bc.gov.educ.ccof.selenium.PageObjects.DeleteApplicationPage;

public class DeleteApplication extends BaseTest {

	private static final Logger logger = LogManager.getLogger(ValidLogin.class);

	@Test(priority = 1)
	public void Deleteapplication(Method method) throws Throwable {
		ExtentTestManager.startTest(method.getName(), "valid login");
		logger.info("Starting the test...");
		CRMSignInCredentialPage objCRMSignInCredentialPage = new CRMSignInCredentialPage(driver);
		objCRMSignInCredentialPage.enterUserId(CRM_USERNAME);
		objCRMSignInCredentialPage.clickNext();
		objCRMSignInCredentialPage.enterPassword(CRM_PASSWORD);
		Thread.sleep(2000);
		objCRMSignInCredentialPage.clickSignIn();
		Thread.sleep(2000);
		objCRMSignInCredentialPage.clickYes();
		Thread.sleep(2000);
		objCRMSignInCredentialPage.clickSignInAgain();
		Thread.sleep(8000);
		objCRMSignInCredentialPage.clickOrgFacilities();
		Thread.sleep(8000);
		DeleteApplicationPage deleteapp = new DeleteApplicationPage(driver);
		deleteapp.searchBox("QA218 OFM");
		Thread.sleep(5000);
		deleteapp.PressEnter();
		Thread.sleep(5000);
		deleteapp.FullName();
		Thread.sleep(5000);
		deleteapp.cancelBtn();
		deleteapp.selectIdCheckBox();
		Thread.sleep(5000);
		deleteapp.threeDotsbtn();
		Thread.sleep(5000);
		deleteapp.MouseOverDelete();
		Thread.sleep(5000);
		deleteapp.deleteBtnPopup();
		Thread.sleep(10000);
		deleteapp.saveAndCloseBtn();
		Thread.sleep(5000);
		deleteapp.ignoreAndSaveBtn();
		logger.info("Ending the test...");

	}

}
