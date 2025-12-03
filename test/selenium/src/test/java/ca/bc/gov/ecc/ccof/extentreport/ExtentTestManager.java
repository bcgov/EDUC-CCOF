package ca.bc.gov.ecc.ccof.extentreport;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;

public class ExtentTestManager {

	private static final ExtentReports extent = ExtentManager.createExtentReports();
	private static final ThreadLocal<ExtentTest> extentTestThreadLocal = new ThreadLocal<>();

	// Prevent instantiation
	private ExtentTestManager() {
	}

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
