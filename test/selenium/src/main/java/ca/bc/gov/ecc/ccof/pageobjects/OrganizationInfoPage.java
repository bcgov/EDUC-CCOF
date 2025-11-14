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

public class OrganizationInfoPage extends BaseTest {
	WebDriverWait wait;

	@FindBy(xpath = "//*[@aria-label='New Org']")
	WebElement openMainApplication;

	@FindBy(xpath = "//*[@aria-label='Submitted']")
	List<WebElement> openApplications;

	@FindBy(xpath = "//*[@aria-label='Renewal']")
	WebElement openRenewalApplication;

	@FindBy(xpath = "//*[@col-id='ccof_name']//div[contains(@class,'ms-StackItem truncatableText')]//a")
	WebElement openFundingAgreement;

	@FindBy(xpath = "//*[contains(text(),'Funding Agreement History')]")
	WebElement fundingAgreementHistory;

	@FindBy(xpath = "//*[@aria-label='Organization ID']")
	WebElement organizationID;

	@FindBy(xpath = "//*[@aria-label='Save (CTRL+S)']")
	WebElement saveBtn;

	@FindBy(xpath = "//*[@title= 'Ignore and save']")
	WebElement ignoreAndSaveBtn;

	public OrganizationInfoPage(WebDriver driver) {
		BaseTest.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void clickMainApplication() {
		Actions action = new Actions(driver);
		action.moveToElement(openMainApplication).doubleClick().build().perform();
	}

	public void clickRenewalApplication() {
		Actions action = new Actions(driver);
		action.moveToElement(openRenewalApplication).doubleClick().build().perform();
	}

	public void clickFundingAgreement() {
		Actions action = new Actions(driver);
		action.moveToElement(openFundingAgreement).doubleClick().build().perform();
	}

	public WebElement getOpenFundingAgreement() {
		return fundingAgreementHistory;
	}

	public WebElement getOpenRenewalApplication() {
		return openRenewalApplication;
	}

	public List<WebElement> getOpenApplications() {
		return openApplications;
	}

	public void enterOrgId(String orgId) {
		organizationID.sendKeys(orgId);
	}

	public void clickSaveBtn() {
		saveBtn.click();
	}

	public WebElement ignoreAndSaveButton() {
		return ignoreAndSaveBtn;
	}

}
