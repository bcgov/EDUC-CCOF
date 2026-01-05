package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;
import java.util.List;
import java.util.NoSuchElementException;

import org.openqa.selenium.By;
import org.openqa.selenium.ElementClickInterceptedException;
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
	List<WebElement> NewApprovableFeeSchedule;

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

	public List<WebElement> NewApprovableFeeScheduleLabel() {
		return NewApprovableFeeSchedule;
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

		// Scroll down by 0 on X axis and 500 pixels on Y axis
		action.scrollByAmount(0, 500).perform();

		// Scroll further down
		action.scrollByAmount(0, 800).perform();

		action.moveToElement(selectApprovableFeeScheduleCheckbox).doubleClick().build().perform();
	}

	public void scrollContainerToElement(WebElement el) {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("var target = arguments[0];" +
		// try common grid viewport classes; adjust to your DOM if needed
				"var c = target.closest('.ag-body-viewport, .ms-DetailsList, .dwmms-grid-viewport, [data-is-scrollable=\"true\"]');"
				+ "if (c) {" + "  var top = target.offsetTop - c.clientHeight/2;" + "  c.scrollTop = Math.max(0, top);"
				+ "} else {" + "  target.scrollIntoView({block:'center', inline:'nearest'});" + "}", el);
	}

	public void jsClickCenter(WebElement clickable) {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("var el=arguments[0];" + "el.scrollIntoView({block:'center', inline:'nearest'});"
				+ "var r=el.getBoundingClientRect();"
				+ "var opts={bubbles:true,cancelable:true,view:window,clientX:r.left+r.width/2,clientY:r.top+r.height/2};"
				+ "el.dispatchEvent(new MouseEvent('mousedown', opts));"
				+ "el.dispatchEvent(new MouseEvent('mouseup', opts));"
				+ "el.dispatchEvent(new MouseEvent('click', opts));", clickable);
	}

	public void clickSelectApprovableFeeScheduleCheckbox2() {
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(25));
		By inputLocator = By.xpath("//input[@type='checkbox' and @aria-label='select or deselect the row']");

		// 1) Get fresh input
		WebElement input = wait.until(ExpectedConditions.presenceOfElementLocated(inputLocator));

		// 2) Resolve clickable wrapper
		WebElement clickable;
		try {
			clickable = input.findElement(By.xpath("ancestor::label[1]"));
		} catch (NoSuchElementException e) {
			// Fluent/Fabric often uses a styled span/div next to the input
			clickable = input.findElement(By.xpath(
					"ancestor::*[self::div or self::span][contains(@class,'Checkbox') or contains(@class,'checkbox')][1]"));
		}

		// 3) Scroll appropriate container (viewport or page)
		scrollContainerToElement(clickable);

		// 4) Try normal click, then JS fallback
		try {
			wait.until(ExpectedConditions.elementToBeClickable(clickable)).click();
		} catch (ElementClickInterceptedException e1) {
			((JavascriptExecutor) driver).executeScript("arguments[0].click();", clickable);
		} catch (Exception e2) {
			// Final fallback: dispatch mouse events
			jsClickCenter(clickable);
		}

		// 5) Assert state changed
		wait.until(d -> {
			WebElement re = d.findElement(inputLocator);
			String aria = re.getAttribute("aria-checked");
			return re.isSelected() || "true".equalsIgnoreCase(aria);
		});
	}

	public WebElement selectApprovableFeeScheduleCheckboxElement() {
		return selectApprovableFeeScheduleCheckbox;
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

}
