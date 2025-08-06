package ca.bc.gov.educ.ccof.selenium.TestCases;

import org.openqa.selenium.WebDriver;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

import com.aventstack.extentreports.MediaEntityBuilder;

public class TestListener implements ITestListener {

	@Override
	public void onTestStart(ITestResult result) {
		BaseTest.test = BaseTest.extent.createTest(result.getMethod().getMethodName());
		BaseTest.test.info("Starting " + result.getMethod().getMethodName());
	}

	@Override
	public void onTestSuccess(ITestResult result) {
		BaseTest.test.pass(result.getMethod().getMethodName() + " passed");
	}

	@Override
	public void onTestFailure(ITestResult result) {
		try {
			BaseTest.test.fail(result.getMethod().getMethodName() + " failed");

			WebDriver driver;

			driver = (WebDriver) result.getTestClass().getRealClass().getDeclaredField("driver")
					.get(result.getInstance());
			String screenshotPath = BaseTest.getScreenshot(driver, result.getMethod().getMethodName());
			
			BaseTest.test.fail(result.getMethod().getMethodName() + "failed",
					MediaEntityBuilder.createScreenCaptureFromPath(screenshotPath).build());
			BaseTest.test.fail("Error Details" + result.getThrowable());
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	@Override
	public void onTestSkipped(ITestResult result) {
		BaseTest.test.skip(result.getMethod().getMethodName() + " skipped");
	}

	@Override
	public void onStart(ITestContext context) {
	}

	@Override
	public void onFinish(ITestContext context) {
		BaseTest.extent.flush();
	}

}

