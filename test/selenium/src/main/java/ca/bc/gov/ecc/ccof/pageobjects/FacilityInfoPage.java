package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class FacilityInfoPage {
	WebDriverWait wait;
	WebDriver driver;

	@FindBy(xpath = "//*[contains(@id,'headerControlsList_')]//div[3]//a")
	WebElement facilityNameLink;

	@FindBy(xpath = "//*[@aria-label='More Header Editable Fields']")
	WebElement myccsTestDropdown;

	@FindBy(xpath = "//*[@aria-label='Status']")
	WebElement facilityStatusField;

	@FindBy(xpath = "//div[@role='listbox']//div[text()='CCFRI Complete']")
	WebElement ccfriCompleteOption;

	@FindBy(xpath = "//*[contains(text(),'Save & Close')]")
	WebElement saveAndCloseFacilityBtn;

	@FindBy(xpath = "//*[@title= 'Ignore and save']")
	WebElement ignoreAndSaveBtn;

	@FindBy(xpath = "//*[@title='Initial Decision']")
	WebElement initialDecisionlink;

	@FindBy(xpath = "//*[@aria-label='ID']")
	WebElement facilityID;

	// initial decision tab elements can be added here

	@FindBy(xpath = "//*[@aria-label='CCFRI Adjudicator Recommendation']")
	WebElement ccfriRecommendationField;

	@FindBy(xpath = "//*[contains(@id,'fluent-listbox')]//div[contains(@id,'fluent-option')]")
	List<WebElement> ccfriAdjudicatorRecommendation;

	@FindBy(xpath = "//iframe[@id='WebResource_CCFRIFacility']")
	WebElement ccfriStartDateIFrame;

	@FindBy(xpath = "//*[@id='month']")
	WebElement ccfriPaymentEligibilityStartDate;

	@FindBy(xpath = "//*[@aria-label='CCFRI QC Decision']")
	WebElement ccfriQcDecisionField;

	@FindBy(xpath = "//*[contains(@id,'fluent-listbox')]//div[contains(@id,'fluent-option')]")
	List<WebElement> ccfriQcDecisionOptions;

	// main facility page

	@FindBy(xpath = "//*[@title='Save']")
	WebElement saveBtn;

	@FindBy(xpath = "//span[@id='expandIcon']")
	WebElement expandIcon;

	@FindBy(xpath = "//*[@aria-label='CCFRI Status']")
	WebElement ccfriStatusField;

	@FindBy(xpath = "//*[contains(@id,'fluent-listbox')]//div[contains(@id,'fluent-option')]")
	List<WebElement> ccfriStatusOptions;

	@FindBy(xpath = "//*[contains(text(),'Save & Close')]")
	WebElement saveAndCloseCcfriFacilityBtn;

	public FacilityInfoPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void clickFacilityNameLink() {
		facilityNameLink.click();
	}

	public void clickMyCcsTestDropdown() {
		myccsTestDropdown.click();
	}

	public void clickFacilityStatusField() {
		facilityStatusField.click();
	}

	public void mouseOverCcfriComplete() {
		Actions action = new Actions(driver);
		action.moveToElement(ccfriCompleteOption).click().build().perform();
	}

	public void clickSaveAndCloseFacilityBtn() {
		saveAndCloseFacilityBtn.click();
	}

	public void clickInitialDecisionLink() {
		initialDecisionlink.click();
	}

	public WebElement ignoreAndSaveButton() {
		return ignoreAndSaveBtn;
	}

//initial decision tab methods can be added here

	public void clickCcfriRecommendationField() {
		ccfriRecommendationField.click();
	}

	public void switchToCcfriStartDateIFrame() {
		wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(ccfriStartDateIFrame));

	}

	public WebElement getCCFRIPaymentEligibilityStartDate() {
		return ccfriPaymentEligibilityStartDate;
	}

	public void switchToDefaultContent() {
		driver.switchTo().defaultContent();
	}

	public List<WebElement> getCCFRIAdjudicatorRecommendation() {
		return ccfriAdjudicatorRecommendation;
	}

	public void clickCcfriQcDecisionField() {
		ccfriQcDecisionField.click();
	}

	public List<WebElement> getCCFRIQCDecision() {
		return ccfriQcDecisionOptions;
	}

	// main page methods

	public void clickSaveBtn() {
		saveBtn.click();
	}

	public void clickExpandIcon() {
		expandIcon.click();
	}

	public void clickCcfriStatusField() {
		ccfriStatusField.click();
	}

	public List<WebElement> getCcfriStatusOptions() {
		return ccfriStatusOptions;
	}

	public void clickSaveAndCloseCcfriFacilityBtn() {
		saveAndCloseCcfriFacilityBtn.click();
	}

	public void enterFacId(String facId) {
		facilityID.sendKeys(facId);
	}

}
