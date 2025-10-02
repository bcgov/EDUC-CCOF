package ca.bc.gov.ecc.ccof.base;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeSuite;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;

import io.github.bonigarcia.wdm.WebDriverManager;

public abstract class BaseTest {

	protected ExtentReports extent;
	protected ExtentTest test;
	protected Properties properties;
	protected String QA_CRM_URL;
	protected String CRM_USERNAME;
	protected String CRM_PASSWORD;
	protected String UAT_CRM_URL;
	protected String BROWSER;
	public Logger logger;

	protected WebDriver driver;
	static String destination;

	public void browserSetup(String browser, String url) {
		if (browser.equalsIgnoreCase("chrome")) {
			WebDriverManager.chromedriver().setup();
			driver = new ChromeDriver();
		} else if (browser.equalsIgnoreCase("edge")) {
			WebDriverManager.edgedriver().setup();
			driver = new EdgeDriver();
		} else if (browser.equalsIgnoreCase("firefox")) {
			WebDriverManager.firefoxdriver().setup();
			driver = new FirefoxDriver();
		}
		driver.manage().window().maximize();
		driver.get(url);
	}

	@BeforeMethod
	public void initDriver() throws InterruptedException {
		browserSetup(BROWSER, QA_CRM_URL);
		Thread.sleep(1000);
	}

	@AfterMethod
	public void tearDown() {
		driver.close();
	}

	String filepath = System.getProperty("user.dir") + "//config.properties";

	@BeforeSuite
	public void setup() {
		FileInputStream fileInputStream = null;
		try {
			logger = Logger.getLogger("CCOFCRM");

			properties = new Properties();
			fileInputStream = new FileInputStream(filepath);
			properties.load(fileInputStream);

			CRM_USERNAME = properties.getProperty("crm_username");
			CRM_PASSWORD = properties.getProperty("crm_password");
			QA_CRM_URL = properties.getProperty("qa_crm_url");
			BROWSER = properties.getProperty("browser");
			UAT_CRM_URL = properties.getProperty("uat_crm_url");
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (fileInputStream != null) {
				try {
					fileInputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

}