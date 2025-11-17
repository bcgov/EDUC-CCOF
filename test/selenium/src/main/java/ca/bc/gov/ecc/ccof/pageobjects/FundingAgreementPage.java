package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

public class FundingAgreementPage {
	WebDriverWait wait;
	WebDriver driver;

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

	public FundingAgreementPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	// methods can be added here
	public WebElement clickReadyForProviderAction() {
		return readyForProviderActionField;
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
		saveBtn.click();
	}

	public void clickSaveAndClose() {
		saveAndCloseFacilityBtn.click();
	}

	public void clickExpandIcon() {
		expandIcon.click();
	}

	public void clickStatusReason() {
		statusReasonField.click();
	}

	public List<WebElement> getStatusReasonField() {
		return statusReasonOptions;
	}

}
