package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

public class CcofPage {
	WebDriverWait wait;
	WebDriver driver;
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

	// Renewal application
	@FindBy(xpath = "//*[@aria-label='Signing Authority: Mark Complete']")
	WebElement signingAuthorityField;

	@FindBy(xpath = "//*[@aria-label='All Licenses Correct: Mark Complete']")
	WebElement allLicensesCorrectField;

	public CcofPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	// methods can be added here
	public void clickCcofAdjudicationLink() {
		ccofAdjudicationLink.click();
	}

	public WebElement waitBeforeCcofAdjudicationLink() {
		return ccofAdjudicationLink;
	}

	public WebElement clickNewApplicationIsSignedBtn() {
		return newApplicationIsSignedField;
	}

	public WebElement clickApplicationFormAndLicenseSubmittedBtn() {
		return applicationFormAndLicenseSubmittedField;
	}

	public WebElement clickLegalNameAndLicenseMatchBtn() {
		return legalNameAndLicenseMatchField;
	}

	public WebElement clickLicenseValidInHealthSpaceBtn() {
		return licenseValidInHealthSpaceField;
	}

	public WebElement clickMailingAddressInCasSupplierBtn() {
		return mailingAddressInCasSupplierField;
	}

	public WebElement clickProviderPreviouslyWithCcofBtn() {
		return providerPreviouslyWithCcofField;
	}

	public WebElement clickProviderInGoodStandingBtn() {
		return providerInGoodStandingField;
	}

	public WebElement clickBasePayEligibleBtn() {
		return basePayEligibleField;
	}

	public WebElement clickBasePayActivatedBtn() {
		return basePayActivatedField;
	}

	// Renewal application methods
	public WebElement clickSigningAuthorityBtn() {
		return signingAuthorityField;
	}

	public WebElement clickAllLicensesCorrectBtn() {
		return allLicensesCorrectField;
	}

	public void clickSaveBtn() {
		saveBtn.click();
	}

	public WebElement waitBeforeClickSaveBtn() {
		return saveBtn;
	}

	public void clickDashboardLink() {
		dashboardLink.click();
	}

	public WebElement waitBeforeDashboardLink() {
		return dashboardLink;
	}

	public void clickBaseFundingProgressStatusField() {
		baseFundingProgressStatusField.click();
	}

	public WebElement waitBeforeBaseFundingProgressStatusField() {
		return baseFundingProgressStatusField;
	}

	public List<WebElement> getBaseFundingProgressStatusOptions() {
		return baseFundingProgressStatusOptions;
	}

	public void clickSaveAndCloseBtn() {
		saveAndCloseBtn.click();
	}

	public WebElement waitBeforeSaveAndCloseBtn() {
		return saveAndCloseBtn;
	}

}
