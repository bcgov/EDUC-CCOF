package ca.bc.gov.ecc.ccof.utils;

import java.time.Duration;
import java.util.List;
import java.util.NoSuchElementException;

import org.junit.jupiter.api.Assertions;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.Wait;
import org.openqa.selenium.support.ui.WebDriverWait;

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
		if (element != null && element.isDisplayed() && element.isEnabled()) {
			element.click();
		}
	}

	public void waitForElementToLoad(WebElement ele) {
		Wait<WebDriver> waitForElement = new FluentWait<>(driver).withTimeout(Duration.ofSeconds(100))
				.pollingEvery(Duration.ofSeconds(5)).ignoring(NoSuchElementException.class);
		waitForElement.until(ExpectedConditions.visibilityOf(ele));
	}

	public void assertElementDeleted(List<WebElement> elements) {
		Assertions.assertTrue(elements.isEmpty(), "Expected elements to be deleted, but some are still present");
	}

}
