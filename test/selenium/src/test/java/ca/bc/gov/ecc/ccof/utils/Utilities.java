package ca.bc.gov.ecc.ccof.utils;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import ca.bc.gov.ecc.ccof.base.BaseTest;

public class Utilities extends BaseTest {
	WebDriverWait wait;

	public Utilities(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
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
			logger.error("Unable to click element: " + e.getMessage());
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

}
