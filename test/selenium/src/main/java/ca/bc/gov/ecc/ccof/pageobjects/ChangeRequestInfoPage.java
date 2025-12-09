package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ChangeRequestInfoPage {

	WebDriverWait wait;
	WebDriver driver;

	@FindBy(xpath = "//*[@title='Change Request Adjudication']")
	WebElement changeRequestAdjudicationTab;

	@FindBy(xpath = "//*[@aria-label='Add New Facility']")
	WebElement addNewFacilityChangeActions;

	@FindBy(xpath = "//*[@aria-label='Other Changes']")
	WebElement otherChangesChangeActions;

	@FindBy(xpath = "//*[@aria-label='Parent Fee Change (MTFI)']")
	WebElement parentFeeMTFIChangeActions;

	@FindBy(xpath = "//*[@aria-label='More Header Editable Fields']")
	WebElement moreHeaderEditableFields;

	@FindBy(xpath = "//*[@aria-label='Internal Status']")
	WebElement internalStatusField;

	@FindBy(xpath = "//div[@role='listbox']//div[text()='Complete']")
	WebElement internalStatusCompleteOption;

	@FindBy(xpath = "//*[@aria-label='Save (CTRL+S)']")
	WebElement saveBtn;

	@FindBy(xpath = "//*[@aria-label='Overview']")
	WebElement overviewTab;

	@FindBy(xpath = "//*[@aria-label='External Status']")
	WebElement externalStatusField;

	public ChangeRequestInfoPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void clickChangeRequestAdjudicationTab() {
		changeRequestAdjudicationTab.click();
	}

	public void clickAddNewFacilityChangeActions() {
		Actions action = new Actions(driver);
		action.moveToElement(addNewFacilityChangeActions).doubleClick().build().perform();
	}

	public void clickOtherChangesChangeActions() {
		Actions action = new Actions(driver);
		action.moveToElement(otherChangesChangeActions).doubleClick().build().perform();
	}

	public void clickParentFeeMTFIChangeActions() {
		Actions action = new Actions(driver);
		action.moveToElement(parentFeeMTFIChangeActions).doubleClick().build().perform();
	}

	public void clickMoreHeaderEditableFields() {
		moreHeaderEditableFields.click();
	}

	public void clickInternalStatusField() {
		internalStatusField.click();
	}

	public void mouseOverInternalStatusCompleteOption() {
		Actions action = new Actions(driver);
		action.moveToElement(internalStatusCompleteOption).click().build().perform();
	}

	public void clickSaveBtn() {
		saveBtn.click();
	}

	public void clickOverviewTab() {
		overviewTab.click();
	}

	public String getInternalStatus() {
		return wait.until(ExpectedConditions.visibilityOf(internalStatusField)).getAttribute("value");
	}

	public String getExternalStatus() {
		return wait.until(ExpectedConditions.visibilityOf(externalStatusField)).getAttribute("value");
	}
}
