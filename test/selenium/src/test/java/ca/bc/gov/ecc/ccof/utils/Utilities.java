package ca.bc.gov.ecc.ccof.utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.List;
import java.util.Random;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

public class Utilities {
	WebDriverWait wait;
	static JSONObject testData;
	WebDriver driver;

	private static final Logger logger = LogManager.getLogger(Utilities.class);

	public Utilities(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public String generateDynamicValue(String jsonKey) throws IOException {
		String prefix = getDataFromJson(jsonKey);
		Random random = new Random();
		int randomNumber = random.nextInt(10000) + 1;
		String dynamicValue = prefix + randomNumber;
		logger.info("Entered ID as : {}", dynamicValue);
		return dynamicValue;
	}

	public String getDataFromJson(String jsonData) throws IOException {
		String content = new String(
				Files.readAllBytes(Paths.get(System.getProperty("user.dir") + "//data//testData.json")));
		testData = new JSONObject(content);
		return testData.getString(jsonData);
	}

	public void scrollToElement(WebElement ele) {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].scrollIntoView(true);", ele);
	}

	public void selectvalue(WebElement ele, String value) {
		Select select = new Select(ele);
		select.selectByVisibleText(value);
	}

	public void waitForElement(WebElement ele) {
		wait = new WebDriverWait(driver, Duration.ofMinutes(1));
		wait.until(ExpectedConditions.visibilityOf(ele));
	}

	public void mouseOverAction(WebElement ele) {
		Actions action = new Actions(driver);
		action.moveToElement(ele).click().build().perform();
	}

	public void selectDropdownValue(String value, List<WebElement> dropdownListValues) {
		for (WebElement option : dropdownListValues) {
			String valueDisplay = option.getText();
			if (valueDisplay.equals(value)) {
				option.click();
				break;
			}
		}
	}

	public void javaScriptExecutorAction(WebElement ele) {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", ele);
	}

	public void clickIfPresent(WebElement element) {
		try {
			if (element != null && element.isDisplayed() && element.isEnabled()) {
				element.click();
			}
		} catch (Exception e) {
			logger.error("Unable to click element: {}", e.getMessage());
		}

	}

	public void waitForElementToLoad(WebElement ele) {
		new WebDriverWait(driver, Duration.ofSeconds(100));

		// Wait for the document to be fully loaded
		wait.until(webDriver -> ((JavascriptExecutor) webDriver).executeScript("return document.readyState")
				.equals("complete"));

		// Wait for the element to be visible
		wait.until(ExpectedConditions.visibilityOf(ele));
	}

	public void assertElementDeleted(List<WebElement> elements) {
		Assert.assertTrue(elements.isEmpty(), "Expected elements to be deleted, but some are still present");
	}

	public void compareValues(String expected, String actual) {
		Assert.assertEquals(actual, expected, "Actual value: " + actual + "Expected value: " + expected);
	}

}
