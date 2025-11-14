package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

import ca.bc.gov.ecc.ccof.base.BaseTest;

public class ApplicationInfoPage extends BaseTest {
	WebDriverWait wait;

	@FindBy(xpath = "//*[@title='Related']")
	WebElement relatedTab;

	@FindBy(xpath = "//*[@data-id='form-tab-relatedEntity-nav_ccof_adjudication_ccfri_Application']")
	WebElement selectCcfrisLink;

	@FindBy(xpath = "//*[@col-id='ccof_name']//div//a")
	WebElement ccfrisLink;

	@FindBy(xpath = "//*[@data-id='form-tab-relatedEntity-nav_ccof_adjudication_Application_ccof_applic']")
	WebElement selectCcfosLink;

	@FindBy(xpath = "//*[@col-id='ccof_name']//div//a")
	WebElement ccfosLink;

	@FindBy(xpath = "//*[@title='CCOF']")
	WebElement ccofTab;

	@FindBy(xpath = "//*[@aria-label='CCOF Status']")
	WebElement ccofStatus;

	@FindBy(xpath = "//*[contains(@id,'fluent-listbox')]//div[contains(@id,'fluent-option')]")
	List<WebElement> ccofStatusOptions;

	@FindBy(xpath = "//*[@title='Save']")
	WebElement saveBtn;

	@FindBy(xpath = "//*[@title='Delete']")
	WebElement deleteBtn;

	@FindBy(xpath = "//*[@data-id='confirmButton']")
	WebElement deleteConfirmBtn;

	// declaration B status
	@FindBy(xpath = "//*[@aria-label='Declaration B Status']")
	WebElement declarationBStatus;

	@FindBy(xpath = "//*[contains(@id,'fluent-listbox')]//div[contains(@id,'fluent-option')]")
	List<WebElement> declarationBStatusOptions;

	public ApplicationInfoPage(WebDriver driver) {
		BaseTest.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void clickRelatedTab() {
		relatedTab.click();
	}

	public WebElement waitBeforeRelatedTab() {
		return relatedTab;
	}

	public void clickCCFRISLink() {
		selectCcfrisLink.click();
	}

	public void clickCcfri() {
		ccfrisLink.click();
	}

	public void clickCCFOSLink() {
		Actions action = new Actions(driver);
		action.moveToElement(selectCcfosLink).click().build().perform();
	}

	public WebElement waitBeforeCCFOSLink() {
		return selectCcfosLink;
	}

	public void clickCcfos() {
		ccfosLink.click();
	}

	public WebElement waitBeforeClickCcfos() {
		return ccfosLink;
	}

	public void clickCcofTab() {
		ccofTab.click();
	}

	public WebElement waitBeforeCcofTab() {
		return ccofTab;
	}

	public void clickCcofStatus() {
		ccofStatus.click();
	}

	public WebElement waitBeforeCcofStatus() {
		return ccofStatus;
	}

	public List<WebElement> getCcofStatusOptions() {
		return ccofStatusOptions;
	}

	public void clickSaveBtn() {
		saveBtn.click();
	}

	public WebElement waitBeforeSaveBtn() {
		return saveBtn;
	}

	public void clickDeleteBtn() {
		deleteBtn.click();
	}

	public void clickDeleteConfirmBtn() {
		deleteConfirmBtn.click();
	}

	public void clickDeclarationBStatus() {
		declarationBStatus.click();
	}

	public List<WebElement> getDeclarationBStatusOptions() {
		return declarationBStatusOptions;
	}
}
