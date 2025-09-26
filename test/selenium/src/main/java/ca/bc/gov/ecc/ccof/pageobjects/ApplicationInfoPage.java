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

import ca.bc.gov.ecc.ccof.baseclass.BaseTest;

public class ApplicationInfoPage extends BaseTest {
	WebDriverWait wait;

	public ApplicationInfoPage(WebDriver driver) {
		BaseTest.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	@FindBy(xpath = "//*[@title='Related']")
	WebElement relatedTab;

	@FindBy(xpath = "//*[@data-id='form-tab-relatedEntity-nav_ccof_adjudication_ccfri_Application']")
	WebElement selectCcfrisLink;

	@FindBy(xpath = "//*[@col-id='ccof_name']//div//a")
	WebElement CcfrisLink;

	@FindBy(xpath = "//*[@data-id='form-tab-relatedEntity-nav_ccof_adjudication_Application_ccof_applic']")
	WebElement selectCcfosLink;

	@FindBy(xpath = "//*[@col-id='ccof_name']//div//a")
	WebElement CcfosLink;

	@FindBy(xpath = "//*[@title='CCOF']")
	WebElement CcofTab;

	@FindBy(xpath = "//*[@aria-label='CCOF Status']")
	WebElement CcofStatus;

	@FindBy(xpath = "//*[contains(@id,'fluent-listbox')]//div[contains(@id,'fluent-option')]")
	List<WebElement> CcofStatusOptions;

	@FindBy(xpath = "//*[@title='Save']")
	WebElement saveBtn;

	public void clickRelatedTab() {
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
		wait.until(ExpectedConditions.elementToBeClickable(relatedTab)).click();
	}

	public void clickCCFRISLink() {
		wait.until(ExpectedConditions.elementToBeClickable(selectCcfrisLink)).click();
	}

	public void clickCcfri() {
		wait.until(ExpectedConditions.elementToBeClickable(CcfrisLink)).click();
	}

	public void clickCCFOSLink() throws InterruptedException {
		Actions action = new Actions(driver);
		action.moveToElement(selectCcfosLink).click().build().perform();
		Thread.sleep(5000);
	}

	public void clickCcfos() {
		wait.until(ExpectedConditions.elementToBeClickable(CcfosLink)).click();
	}

	public void clickCcofTab() {
		wait.until(ExpectedConditions.elementToBeClickable(CcofTab)).click();
	}

	public void clickCcofStatus() {
		wait.until(ExpectedConditions.elementToBeClickable(CcofStatus)).click();
	}

	public void getCcofStatusOptions(String value) {
		List<WebElement> valueOptions = CcofStatusOptions;
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

	public void clickSaveBtn() {
		wait.until(ExpectedConditions.elementToBeClickable(saveBtn)).click();
	}
}
