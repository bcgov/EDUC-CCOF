package ca.bc.gov.educ.ccof.selenium.TestCases;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.stream.Stream;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;

public class BaseTest {
	protected static ExtentReports extent;
	protected static ExtentTest test;
	protected static Properties properties;
	protected static String QA_CRM_URL;
	protected static String CRM_USERNAME;
	protected static String CRM_PASSWORD;
	protected static String UAT_CRM_URL;
	public static Logger logger;
	
	
	@BeforeSuite
	public void setup() {
		try {
			ExtentSparkReporter sparkReporter = new ExtentSparkReporter("extent-report.html");
			extent = new ExtentReports();
			extent.attachReporter(sparkReporter);
			
			logger=Logger.getLogger("CCOFCRM");
			PropertyConfigurator.configure("Log4j.properties");
			
			properties = new Properties();
			FileInputStream fileInputStream = new FileInputStream("config.properties");
			properties.load(fileInputStream);
			fileInputStream.close();
			
			CRM_USERNAME = properties.getProperty("crm_username");
			CRM_PASSWORD = properties.getProperty("crm_password");
			
			// QA credentials
			QA_CRM_URL = properties.getProperty("qa_crm_url");
			
			// UAT credentials
			UAT_CRM_URL = properties.getProperty("uat_crm_url");
			
			cleanTestExecutionScreenshots();		

		} catch (IOException e) {
			e.printStackTrace();
		}

	}
	
	// Cleans out the TestExecutionScreenshots
	public static void cleanTestExecutionScreenshots() {
		Path folderPath = Paths.get("TestExecutionScreenshots");

		try (Stream<Path> paths = Files.walk(folderPath)) {
            paths.filter(path -> !path.equals(folderPath))
                 .sorted((path1, path2) -> path2.compareTo(path1))
                 .forEach(path -> {
                     try {
                         Files.delete(path);
                     } catch (IOException e) {
                         e.printStackTrace();
                     }
                 });
        }
        catch(Exception e) {
    	   System.out.println("[INFO] There is no folder for screenshots created yet, one will be created");
        }
	}

	public static String getScreenshot(WebDriver driver, String screenshotName) throws Exception {
		TakesScreenshot ts = (TakesScreenshot) driver;
		File source = ts.getScreenshotAs(OutputType.FILE);
		String destination;
		
		// after execution, takes screenshot of either failed or pass
		destination = System.getProperty("user.dir") + File.separator + "TestExecutionScreenshots" + File.separator + screenshotName + ".png";
		
		File finalDestination = new File(destination);
		FileUtils.copyFile(source, finalDestination);
		return destination;
	}

	@AfterMethod
	public void getResult(ITestResult result) {
//		try {
//			if (result.getStatus() == ITestResult.FAILURE) {
//				test.fail("Error Details" + result.getThrowable());
//
//				WebDriver driver;
//
//				driver = (WebDriver) result.getTestClass().getRealClass().getDeclaredField("driver")
//						.get(result.getInstance());
//				BaseTest.getScreenshot(driver, result.getMethod().getMethodName());
//				
//			}
//
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
	}

	@AfterSuite
	private void teardown() {
		extent.flush();
	}

}


