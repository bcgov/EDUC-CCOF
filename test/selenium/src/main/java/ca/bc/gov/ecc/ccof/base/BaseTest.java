package ca.bc.gov.ecc.ccof.base;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;

import io.github.bonigarcia.wdm.WebDriverManager;

public abstract class BaseTest {

	protected ExtentReports extent;
	protected ExtentTest test;
	protected WebDriver driver;
	public static final String CRM_USERNAME;
	public static final String CRM_PASSWORD;
	public static final String QA_CRM_URL;
	public static final String UAT_CRM_URL;
	public static final String BROWSER;
	private static final String PROPERTY_FILE = System.getProperty("user.dir") + "//config.properties";
	protected static final Logger logger;
	private static final Properties properties;

	// Static initialization block
	static {
		logger = Logger.getLogger("CCOFCRM");
		properties = new Properties();
		FileInputStream fileInputStream = null;
		try {
			fileInputStream = new FileInputStream(PROPERTY_FILE);
			properties.load(fileInputStream);
		} catch (IOException e) {
			logger.error("Failed to load properties file: " + e.getMessage());
		}

		CRM_USERNAME = properties.getProperty("crm_username");
		CRM_PASSWORD = properties.getProperty("crm_password");
		QA_CRM_URL = properties.getProperty("qa_crm_url");
		UAT_CRM_URL = properties.getProperty("uat_crm_url");
		BROWSER = properties.getProperty("browser");
	}

	public void browserSetup(String browser, String url) {
		if (browser.equalsIgnoreCase("chrome")) {
			WebDriverManager.chromedriver().setup();
			ChromeOptions options = new ChromeOptions();

			// Check if headless mode is enabled in config.properties
			String headless = properties.getProperty("headless");
			logger.info("Launching browser in headless mode: " + headless);

			if ("true".equalsIgnoreCase(headless)) {
				options.addArguments("--headless");
				options.addArguments("--disable-gpu");
				options.addArguments("--window-size=1920,1080");
				options.addArguments("--no-sandbox");
				options.addArguments("--disable-dev-shm-usage");
			}

			driver = new ChromeDriver(options);

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
	public void initDriver() {
		browserSetup(BROWSER, QA_CRM_URL);
	}

	@AfterMethod
	public void tearDown() {
		driver.close();
	}

}