package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import ca.bc.gov.ecc.ccof.baseclass.BaseTest;

public class FacilityInfoPage extends BaseTest {
	WebDriverWait wait;

	public FacilityInfoPage(WebDriver driver) {
		BaseTest.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

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

	public void clickFacilityNameLink() {
		wait.until(ExpectedConditions.elementToBeClickable(facilityNameLink)).click();
	}

	public void clickMyCcsTestDropdown() {
		wait.until(ExpectedConditions.elementToBeClickable(myccsTestDropdown)).click();
	}

	public void clickFacilityStatusField() {
		wait.until(ExpectedConditions.elementToBeClickable(facilityStatusField)).click();
	}

	public void mouseOverCcfriComplete() throws InterruptedException {
		Actions action = new Actions(driver);
		action.moveToElement(ccfriCompleteOption).click().build().perform();
	}

	public void clickSaveAndCloseFacilityBtn() {
		wait.until(ExpectedConditions.elementToBeClickable(saveAndCloseFacilityBtn)).click();
	}

	public void clickInitialDecisionLink() {
		wait.until(ExpectedConditions.elementToBeClickable(initialDecisionlink)).click();
	}

	public void clickIgnoreAndSaveIfPresent() {
		List<WebElement> elements = driver.findElements(By.xpath("//*[@title='Ignore and save']"));
		Boolean isPresent = elements.isEmpty();
		clickIfPresent(ignoreAndSaveBtn, "Ignore and Save Button", isPresent);
	}

//initial decision tab methods can be added here

	public void clickCcfriRecommendationField() {
		wait.until(ExpectedConditions.elementToBeClickable(ccfriRecommendationField)).click();
	}

	public void switchToCcfriStartDateIFrame() {
		WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(100));
		wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(ccfriStartDateIFrame));

	}

	public WebElement getCCFRIPaymentEligibilityStartDate() {
		return ccfriPaymentEligibilityStartDate;
	}

	public void switchToDefaultContent() {
		driver.switchTo().defaultContent();
	}

	public void getCCFRIAdjudicatorRecommendation(String value) {
		List<WebElement> valueOptions = ccfriAdjudicatorRecommendation;
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

	public void clickCcfriQcDecisionField() {
		wait.until(ExpectedConditions.elementToBeClickable(ccfriQcDecisionField)).click();
	}

	public void getCCFRIQCDecision(String value) {
		List<WebElement> valueOptions = ccfriQcDecisionOptions;
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

	// main page methods

	public void clickSaveBtn() {
		wait.until(ExpectedConditions.elementToBeClickable(saveBtn)).click();
	}

	public void clickExpandIcon() {
		wait.until(ExpectedConditions.elementToBeClickable(expandIcon)).click();
	}

	public void clickCcfriStatusField() {
		wait.until(ExpectedConditions.elementToBeClickable(ccfriStatusField)).click();
	}

	public void getCcfriStatusOptions(String value) {
		List<WebElement> valueOptions = ccfriStatusOptions;
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

	public void clickSaveAndCloseCcfriFacilityBtn() {
		wait.until(ExpectedConditions.elementToBeClickable(saveAndCloseCcfriFacilityBtn)).click();
	}

}
