package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import ca.bc.gov.ecc.ccof.baseclass.BaseTest;

public class FundingAgreementPage extends BaseTest {
	WebDriverWait wait;

	public FundingAgreementPage(WebDriver driver) {
		BaseTest.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	// elements can be added here

	@FindBy(xpath = "//*[@aria-label='Date of Start Date']")
	WebElement startDateField;

	@FindBy(xpath = "//*[@aria-label='Ready for Provider Action: No']")
	WebElement readyForProviderActionField;

	@FindBy(xpath = "//*[@title='Save']")
	WebElement saveBtn;

	@FindBy(xpath = "//*[contains(text(),'Save & Close')]")
	WebElement saveAndCloseFacilityBtn;

	@FindBy(xpath = "//span[@id='expandIcon']")
	WebElement expandIcon;

	@FindBy(xpath = "//*[@aria-label='Status Reason']")
	WebElement statusReasonField;

	@FindBy(xpath = "//*[contains(@id,'fluent-listbox')]//div[contains(@id,'fluent-option')]")
	List<WebElement> statusReasonOptions;

	// methods can be added here

	public void clickReadyForProviderAction() {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", readyForProviderActionField);

	}

	public void enterStartDate(String startdate) throws InterruptedException {
		Thread.sleep(2000);
		startDateField.sendKeys(Keys.chord(Keys.CONTROL, "a"));
		Thread.sleep(2000);
		startDateField.clear();
		Thread.sleep(2000);
		startDateField.sendKeys(startdate);
	}

	public void clickSave() {
		wait.until(ExpectedConditions.elementToBeClickable(saveBtn)).click();
	}

	public void clickSaveAndClose() {
		wait.until(ExpectedConditions.elementToBeClickable(saveAndCloseFacilityBtn)).click();
	}

	public void clickExpandIcon() {
		wait.until(ExpectedConditions.elementToBeClickable(expandIcon)).click();
	}

	public void clickStatusReason() {
		wait.until(ExpectedConditions.elementToBeClickable(statusReasonField)).click();
	}

	public void getStatusReasonOptions(String value) {
		List<WebElement> valueOptions = statusReasonOptions;
		int count = valueOptions.size();
		for (int i = 0; i < count; i++) {
			String valueDisplay = valueOptions.get(i).getText();
			System.out.println(valueDisplay);
			if (valueDisplay.equals(value)) {
				valueOptions.get(i).click();
				break;
			}
		}

	}
}
