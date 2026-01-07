package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;
import java.util.List;
import java.util.NoSuchElementException;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
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
	private JavascriptExecutor js;

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

	@FindBy(xpath = "//*[@type='checkbox' and @aria-label='select or deselect the row' and @tabindex='0']")
	WebElement selectApprovableFeeScheduleCheckbox;

	@FindBy(xpath = "//*[contains(text(),'New Approvable Fee Schedule')]")
	List<WebElement> newApprovableFeeSchedule;

	@FindBy(xpath = "//*[@aria-label='AFS Confirmed: No']")
	WebElement afsConfirmedField;

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
		this.js = (JavascriptExecutor) driver;
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

	public WebElement waitBeforeClickFacilityStatusField() {
		return facilityStatusField;
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

	public List<WebElement> newApprovableFeeScheduleLabel() {
		return newApprovableFeeSchedule;
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

	public void clickSelectApprovableFeeScheduleCheckbox() {
		Actions action = new Actions(driver);
		action.moveToElement(selectApprovableFeeScheduleCheckbox).doubleClick().build().perform();
	}

	public WebElement selectApprovableFeeScheduleCheckboxElement() {
		return selectApprovableFeeScheduleCheckbox;
	}

	public WebElement clickAfsConfirmedField() {
		return afsConfirmedField;
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

	public WebElement waitBeforeClickSaveAndCloseCcfriFacilityBtn() {
		return saveAndCloseCcfriFacilityBtn;
	}

	public void enterFacId(String facId) {
		facilityID.sendKeys(facId);
	}

	public String getCcfriStatus() {
		return wait.until(ExpectedConditions.visibilityOf(ccfriStatusField)).getAttribute("value");
	}

	public WebElement waitForCcfriStatusField() {
		return ccfriStatusField;
	}

	// =========================================================
	// AFS Confirmed - Page Object API
	// =========================================================

	/**
	 * Preferred path: set the AFS Confirmed boolean via Dynamics Xrm client API.
	 */
	public boolean setAfsConfirmedViaXrm(boolean value) {
		driver.switchTo().defaultContent();
		String script = "try {"
				+ "  var a = Xrm && Xrm.Page && Xrm.Page.getAttribute && Xrm.Page.getAttribute('ccof_afs_confirmed');"
				+ "  if (a) { a.setValue(arguments[0]); a.setSubmitMode('always'); a.fireOnChange(); return 'OK'; }"
				+ "  return 'Attribute not found';" + "} catch(e) { return 'Error: ' + e.message; }";
		Object res = js.executeScript(script, value);
		return "OK".equals(res);
	}

	/**
	 * Fallback path: click the AFS Confirmed toggle via DOM. Works regardless of
	 * current state ("Yes" or "No") and handles virtualization via inner container
	 * scroll.
	 */
	public void clickAfsConfirmedToggle(Duration timeout) {
		WebDriverWait localWait = new WebDriverWait(driver, timeout);

		// State‑agnostic locators:
		By toggleBy = By.xpath(
				"//*[contains(@aria-label,'AFS Confirmed') or (@aria-pressed and contains(@aria-label,'AFS Confirmed'))]");
		By labelSiblingBy = By.xpath("//*[normalize-space()='AFS Confirmed']"
				+ "/following::*[@role='switch' or @aria-pressed or contains(@aria-label,'AFS Confirmed')][1]");

		// Switch into the frame containing the toggle
		try {
			switchToFrameContaining(toggleBy, Duration.ofSeconds(8));
		} catch (NoSuchElementException e) {
			switchToFrameContaining(labelSiblingBy, Duration.ofSeconds(8));
		}

		// Nudge inner form scroll to force virtualization to render controls
		scrollInnerFormContainerIfPresent();

		// Locate the toggle
		WebElement toggle;
		toggle = localWait.until(ExpectedConditions.visibilityOfElementLocated(toggleBy));

		// Click to set YES
		bringIntoViewAndClick(toggle);

		String beforePressed = toggle.getAttribute("aria-pressed");
		js.executeScript("arguments[0].click();", toggle);

		if (beforePressed != null) {
			localWait.until(ExpectedConditions.attributeToBe(toggle, "aria-pressed", "true"));
		} else {
			localWait.until(ExpectedConditions.attributeContains(toggle, "aria-label", "Yes"));
		}

		// Optional visual cue for debug
		js.executeScript("arguments[0].style.outline='2px solid magenta';", toggle);
	}

	/**
	 * Switch to the frame that contains `locator`. Returns frame index or -1 if in
	 * default content.
	 */
	private int switchToFrameContaining(By locator, Duration timeout) {
		WebDriverWait localWait = new WebDriverWait(driver, timeout);

		driver.switchTo().defaultContent();
		if (!driver.findElements(locator).isEmpty()) {
			return -1;
		}

		List<WebElement> frames = driver.findElements(By.tagName("iframe"));
		for (int i = 0; i < frames.size(); i++) {
			try {
				driver.switchTo().defaultContent();
				localWait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(i));
				if (!driver.findElements(locator).isEmpty()) {
					return i; // inside the correct frame
				}
			} catch (Exception _) {
			}
		}

		driver.switchTo().defaultContent();
		throw new NoSuchElementException("Locator not found in default content or any frame: " + locator);
	}

	/** Scroll the inner Dynamics form container (virtualize rendering). */
	private void scrollInnerFormContainerIfPresent() {
		List<WebElement> containers = driver.findElements(By.cssSelector(
				"div[role='presentation'][class*='flexbox'], div[aria-label*='Form'], div[aria-label*='Main form']"));
		if (!containers.isEmpty()) {
			js.executeScript("arguments[0].scrollTop = arguments[0].scrollTop + 1000;", containers.get(0));
		}
	}

	/** Bring element into view + focus + click via JS. */
	private void bringIntoViewAndClick(WebElement el) {
		js.executeScript("arguments[0].scrollIntoView({block:'center'});", el);
		js.executeScript("arguments[0].focus();", el);
		js.executeScript("arguments[0].click();", el);
	}
}
