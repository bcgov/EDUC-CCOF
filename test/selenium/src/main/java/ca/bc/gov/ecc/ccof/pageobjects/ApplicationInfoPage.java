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

	public ApplicationInfoPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void clickRelatedTab() {
		relatedTab.click();
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

	public void clickCcfos() {
		ccfosLink.click();
	}

	public void clickCcofTab() {
		ccofTab.click();
	}

	public void clickCcofStatus() {
		ccofStatus.click();
	}

	public List<WebElement> getCcofStatusOptions() {
		return ccofStatusOptions;
	}

	public void clickSaveBtn() {
		saveBtn.click();
	}

	public void clickDeleteBtn() {
		deleteBtn.click();
	}

	public void clickDeleteConfirmBtn() {
		deleteConfirmBtn.click();
	}
}
