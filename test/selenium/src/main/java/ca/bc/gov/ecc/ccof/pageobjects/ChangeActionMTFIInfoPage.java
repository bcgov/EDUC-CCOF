package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ChangeActionMTFIInfoPage {

	WebDriverWait wait;
	WebDriver driver;

	@FindBy(xpath = "//*[@aria-label='MTFI Decision']")
	WebElement newMTFIDecisionTab;

	@FindBy(xpath = "//*[@aria-label='Closure Adjudicator Recommendation']")
	WebElement closureAdjudicatorRecommendationField;

	@FindBy(xpath = "//*[contains(@id,'fluent-listbox')]//div[contains(@id,'fluent-option')]")
	List<WebElement> closureAdjudicatorRecommendation;

	@FindBy(xpath = "//*[@aria-label='Adjudicator Recommendation']")
	WebElement adjudicatorRecommendationField;

	@FindBy(xpath = "//*[contains(@id,'fluent-listbox')]//div[contains(@id,'fluent-option')]")
	List<WebElement> adjudicatorRecommendation;

	@FindBy(xpath = "//*[@aria-label='MTFI-QC Decision']")
	WebElement selectMTFIQCDecisionField;

	@FindBy(xpath = "//*[contains(@id,'fluent-listbox')]//div[contains(@id,'fluent-option')]")
	List<WebElement> enterMTFIQCDecisionOptions;

	@FindBy(xpath = "//*[@aria-label='Save (CTRL+S)']")
	WebElement saveButton;

	@FindBy(xpath = "//*[@aria-label='More Header Editable Fields']")
	WebElement expandIcon;

	@FindBy(xpath = "//*[@aria-label='Status Reason']")
	WebElement statusReasonField;

	@FindBy(xpath = "//*[contains(@id,'fluent-listbox')]//div[contains(@id,'fluent-option')]")
	List<WebElement> statusReasonOptions;

	@FindBy(xpath = "//*[@aria-label='Save & Close']")
	WebElement saveAndCloseButton;

	public ChangeActionMTFIInfoPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void clickMTFIDecisionTab() {
		newMTFIDecisionTab.click();
	}

	public WebElement waitBeforeClickMTFIDecisionTab() {
		return newMTFIDecisionTab;
	}

	public void clickClosureAdjudicatorRecommendationField() {
		closureAdjudicatorRecommendationField.click();
	}

	public WebElement waitBeforeClickClosureAdjudicatorRecommendationField() {
		return closureAdjudicatorRecommendationField;
	}

	public List<WebElement> getClosureAdjudicatorRecommendation() {
		return closureAdjudicatorRecommendation;
	}

	public void clickAdjudicatorRecommendationField() {
		adjudicatorRecommendationField.click();
	}

	public WebElement waitBeforeClickAdjudicatorRecommendationField() {
		return adjudicatorRecommendationField;
	}

	public List<WebElement> getAdjudicatorRecommendation() {
		return adjudicatorRecommendation;
	}

	public void clickMTFIQCDecisionField() {
		selectMTFIQCDecisionField.click();
	}

	public WebElement waitBeforeClickMTFIQCDecisionField() {
		return selectMTFIQCDecisionField;
	}

	public List<WebElement> getMTFIQCDecisionOptions() {
		return enterMTFIQCDecisionOptions;
	}

	public void clickSaveButton() {
		saveButton.click();
	}

	public WebElement waitBeforeClickSaveButton() {
		return saveButton;
	}

	public void clickExpandIcon() {
		expandIcon.click();
	}

	public void clickStatusReasonField() {
		statusReasonField.click();
	}

	public List<WebElement> getStatusReasonOptions() {
		return statusReasonOptions;
	}

	public void clickSaveAndCloseBtn() {
		saveAndCloseButton.click();
	}
}
