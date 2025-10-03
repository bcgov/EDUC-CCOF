package ca.bc.gov.ecc.ccof.extentreport;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;

public class ExtentManager {
	private ExtentManager() {
	}

	public static final ExtentReports extentReports = new ExtentReports();

	public static synchronized ExtentReports createExtentReports() {
		ExtentSparkReporter reporter = new ExtentSparkReporter("./extent-reports/extent-report.html");
		reporter.config().setReportName("Extent Report");
		extentReports.attachReporter(reporter);
		extentReports.setSystemInfo("Project Name", "CCOF");
		extentReports.setSystemInfo("Author", "QA");

		return extentReports;
	}
}