package ca.bc.gov.ecc.ccof.extentreport;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;

public class ExtentTestManager {

	// Prevent instantiation
	private ExtentTestManager() {
	}

	private static final ExtentReports extent = ExtentManager.createExtentReports();
	private static final ThreadLocal<ExtentTest> extentTestThreadLocal = new ThreadLocal<>();

	public static ExtentTest getTest() {
		return extentTestThreadLocal.get();
	}

	public static ExtentTest startTest(String testName, String desc) {
		ExtentTest test = extent.createTest(testName, desc);
		extentTestThreadLocal.set(test);
		return test;
	}

	public static void removeTest() {
		extentTestThreadLocal.remove();
	}
}
