package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

import ca.bc.gov.ecc.ccof.base.BaseTest;

public class OrganizationInfoPage extends BaseTest {
	WebDriverWait wait;

	public OrganizationInfoPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	@FindBy(xpath = "//*[@aria-label='Submitted']")
	WebElement openApplication;

	@FindBy(xpath = "//*[@col-id='ccof_name']//div[contains(@class,'ms-StackItem truncatableText')]//a")
	WebElement openFundingAgreement;

	@FindBy(xpath = "//*[contains(text(),'Funding Agreement History')]")
	WebElement fundingAgreementHistory;

	public void clickApplication() {
		Actions action = new Actions(driver);
		action.moveToElement(openApplication).doubleClick().build().perform();
	}

	public void clickFundingAgreement() {
		Actions action = new Actions(driver);
		action.moveToElement(openFundingAgreement).doubleClick().build().perform();
	}

	public WebElement getOpenFundingAgreement() {
		return fundingAgreementHistory;
	}

}
