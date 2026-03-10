package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ClosurePage {

	WebDriverWait wait;
	WebDriver driver;

    // Closure Type dropdown field
	@FindBy(xpath = "//*[@aria-label='Closure Type']")
	WebElement closureTypeField;

	// Closure Type options list
	@FindBy(xpath = "//*[contains(@id,'fluent-listbox')]//div[contains(@id,'fluent-option')]")
	List<WebElement> closureTypeOptions;

	// Approved As dropdown field
	@FindBy(xpath = "//*[@aria-label='Approved as']")
	WebElement approvedAsField;

	// Approved As options list
	@FindBy(xpath = "//*[contains(@id,'fluent-listbox')]//div[contains(@id,'fluent-option')]")
	List<WebElement> approvedAsOptions;

	// Payment Eligibility dropdown field
	@FindBy(xpath = "//*[@aria-label='Payment Eligibility']")
	WebElement paymentEligibilityField;

	// Payment Eligibility options list
	@FindBy(xpath = "//*[contains(@id,'fluent-listbox')]//div[contains(@id,'fluent-option')]")
	List<WebElement> paymentEligibilityOptions;

	// Arrow / chevron dropdown (expand more fields)
	@FindBy(xpath = "//*[@aria-label='More Header Editable Fields']")
	WebElement arrowDropdown;

	// Closure Status field
	@FindBy(xpath = "//*[@aria-label='Closure Status']")
	WebElement closureStatusField;

	// Closure Status options list
	@FindBy(xpath = "//*[contains(@id,'fluent-listbox')]//div[contains(@id,'fluent-option')]")
	List<WebElement> closureStatusOptions;

	// Save button
	@FindBy(xpath = "//*[@aria-label='Save & Close']")
	WebElement saveBtn;

	public ClosurePage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

    // Closure type
    public void clickClosureType() {
        wait.until(ExpectedConditions.elementToBeClickable(closureTypeField));
        closureTypeField.click();
    }

	public List<WebElement> getClosureTypeOptions() {
		return closureTypeOptions;
	}

	// Approved As
	public void clickApprovedAsField() {
		approvedAsField.click();
	}

	public List<WebElement> getApprovedAsOptions() {
		return approvedAsOptions;
	}

	// Payment Eligibility
	public void clickPaymentEligibilityField() {
		paymentEligibilityField.click();
	}

	public List<WebElement> getPaymentEligibilityOptions() {
		return paymentEligibilityOptions;
	}

	// Arrow dropdown
	public void clickArrowDropdown() {
		arrowDropdown.click();
	}

	public WebElement waitBeforeClickArrowDropdown() {
		return arrowDropdown;
	}

	// Closure Status
	public void clickClosureStatusField() {
		wait.until(ExpectedConditions.elementToBeClickable(closureStatusField));
		closureStatusField.click();
	}

	public List<WebElement> getClosureStatusOptions() {
		return closureStatusOptions;
	}

	// Save
	public void clickSaveBtn() {
		saveBtn.click();
	}
}

