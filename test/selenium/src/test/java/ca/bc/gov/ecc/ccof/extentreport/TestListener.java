
package ca.bc.gov.ecc.ccof.extentreport;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

import com.aventstack.extentreports.Status;

import ca.bc.gov.ecc.ccof.base.BaseTest;

public class TestListener extends BaseTest implements ITestListener {

	private static String getTestMethodName(ITestResult iTestResult) {
		return iTestResult.getMethod().getConstructorOrMethod().getName();
	}

	@Override
	public void onStart(ITestContext iTestContext) {
		logger.info("I am in onStart method {}", iTestContext.getName());
	}

	@Override
	public void onFinish(ITestContext iTestContext) {
		logger.info("I am in onFinish method {}", iTestContext.getName());
		ExtentManager.extentReports.flush();
	}

	@Override
	public void onTestStart(ITestResult iTestResult) {
		logger.info("{} test is starting.", getTestMethodName(iTestResult));
	}

	@Override
	public void onTestSuccess(ITestResult iTestResult) {
		logger.info("{} test is succeed.", getTestMethodName(iTestResult));
		// ExtentReports logger operation for passed tests.
		ExtentTestManager.getTest().log(Status.PASS, "Test passed");
	}

	@Override
	public void onTestFailure(ITestResult iTestResult) {
		logger.info("{} test is failed.", getTestMethodName(iTestResult));
		WebDriver driver = ((BaseTest) iTestResult.getInstance()).getDriver();

		TakesScreenshot scrShot = ((TakesScreenshot) driver);
		File srcfile = scrShot.getScreenshotAs(OutputType.FILE);
		String screenshotPath = System.getProperty("user.dir") + "/screenshots/" + iTestResult.getName() + ".png";

		File destFile = new File(screenshotPath);
		try {
			FileUtils.copyFile(srcfile, destFile);
		} catch (IOException e) {
			logger.error("Failed to save screenshot: {}", e.getMessage());
		}

		// Log failure and attach screenshot to ExtentReports
		ExtentTestManager.getTest().log(Status.FAIL, "Test Failed");
		ExtentTestManager.getTest().addScreenCaptureFromPath(screenshotPath);
	}

	@Override
	public void onTestSkipped(ITestResult iTestResult) {
		logger.info("{} test is skipped.", getTestMethodName(iTestResult));
		ExtentTestManager.getTest().log(Status.SKIP, "Test Skipped");
	}

	@Override
	public void onTestFailedButWithinSuccessPercentage(ITestResult iTestResult) {
		logger.info("Test failed but it is in defined success ratio {}", getTestMethodName(iTestResult));
	}
}
