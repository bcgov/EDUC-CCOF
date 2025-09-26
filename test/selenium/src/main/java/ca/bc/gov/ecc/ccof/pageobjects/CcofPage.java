package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import ca.bc.gov.ecc.ccof.baseclass.BaseTest;

public class CcofPage extends BaseTest {
	WebDriverWait wait;

	public CcofPage(WebDriver driver) {
		BaseTest.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	// elements can be added here

	@FindBy(xpath = "//*[@title='CCOF Adjudication']")
	WebElement ccofAdjudicationLink;

	@FindBy(xpath = "//*[@aria-label='New Application is Signed: No']")
	WebElement newApplicationIsSignedField;

	@FindBy(xpath = "//*[@aria-label='Application Form and License Submitted: No']")
	WebElement applicationFormAndLicenseSubmittedField;

	@FindBy(xpath = "//*[@aria-label='Legal Name and License Match: No']")
	WebElement legalNameAndLicenseMatchField;

	@FindBy(xpath = "//*[@aria-label='License Valid in Health Space: No']")
	WebElement licenseValidInHealthSpaceField;

	@FindBy(xpath = "//*[@aria-label='Mailing Address in CAS Supplier: No']")
	WebElement mailingAddressInCasSupplierField;

	@FindBy(xpath = "//*[@aria-label='Provider previously with CCOF? If Yes - Terminate previous FA: No']")
	WebElement providerPreviouslyWithCcofField;

	@FindBy(xpath = "//*[@aria-label='Provider in Good Standing: No']")
	WebElement providerInGoodStandingField;

	@FindBy(xpath = "//*[@aria-label='Base Pay Eligible: No']")
	WebElement basePayEligibleField;

	@FindBy(xpath = "//*[@aria-label='Base Pay Activated: No']")
	WebElement basePayActivatedField;

	@FindBy(xpath = "//*[@title='Save']")
	WebElement saveBtn;

	@FindBy(xpath = "//*[@title='Dashboard']")
	WebElement dashboardLink;

	@FindBy(xpath = "//*[@data-id='statuscode.fieldControl-option-set-select']")
	WebElement baseFundingProgressStatusField;

	@FindBy(xpath = "//*[contains(text(),'Save & Close')]")
	WebElement saveAndCloseBtn;

	@FindBy(xpath = "//*[contains(@id,'fluent-listbox')]//div[contains(@id,'fluent-option')]")
	List<WebElement> baseFundingProgressStatusOptions;

	// methods can be added here

	public void clickCcofAdjudicationLink() {
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
		wait.until(ExpectedConditions.elementToBeClickable(ccofAdjudicationLink)).click();
	}

	public void clickNewApplicationIsSignedBtn() {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", newApplicationIsSignedField);

	}

	public void clickApplicationFormAndLicenseSubmittedBtn() {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", applicationFormAndLicenseSubmittedField);

	}

	public void clickLegalNameAndLicenseMatchBtn() {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", legalNameAndLicenseMatchField);
	}

	public void clickLicenseValidInHealthSpaceBtn() {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", licenseValidInHealthSpaceField);
	}

	public void clickMailingAddressInCasSupplierBtn() {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", mailingAddressInCasSupplierField);
	}

	public void clickProviderPreviouslyWithCcofBtn() {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", providerPreviouslyWithCcofField);

	}

	public void clickProviderInGoodStandingBtn() {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", providerInGoodStandingField);
	}

	public void clickBasePayEligibleBtn() {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", basePayEligibleField);
	}

	public void clickBasePayActivatedBtn() {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("arguments[0].click();", basePayActivatedField);
	}

	public void clickSaveBtn() {
		wait.until(ExpectedConditions.elementToBeClickable(saveBtn)).click();
	}

	public void clickDashboardLink() {
		wait.until(ExpectedConditions.elementToBeClickable(dashboardLink)).click();
	}

	public void clickBaseFundingProgressStatusField() {
		wait.until(ExpectedConditions.elementToBeClickable(baseFundingProgressStatusField)).click();
	}

	public void getBaseFundingProgressStatusOptions(String value) {
		List<WebElement> valueOptions = baseFundingProgressStatusOptions;
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

	public void clickSaveAndCloseBtn() {
		wait.until(ExpectedConditions.elementToBeClickable(saveAndCloseBtn)).click();
	}

}
