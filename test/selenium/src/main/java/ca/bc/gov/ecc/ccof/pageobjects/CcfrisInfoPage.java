package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import ca.bc.gov.ecc.ccof.base.BaseTest;

public class CcfrisInfoPage extends BaseTest {
	WebDriverWait wait;

	public CcfrisInfoPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	@FindBy(xpath = "//*[@data-id='ccof_systemrecommendation.fieldControl-text-box-text']")
	WebElement systemRecommendation;

	@FindBy(xpath = "//*[@title='CCFRI Facility Adjudication']")
	WebElement ccfriFacilityAdjudicationTitle;

	@FindBy(xpath = "//*[@aria-label='Submitted']")
	WebElement openFacility;

	@FindBy(xpath = "//*[contains(text(),'Save & Close')]")
	WebElement saveAndCloseBtn;

	public String getSystemRecommendation() {
		return wait.until(ExpectedConditions.visibilityOf(systemRecommendation)).getAttribute("value");
	}

	public void clickCcfriFacilityAdjudicationTitle() {
		ccfriFacilityAdjudicationTitle.click();
	}

	public void clickOpenFacility() {
		Actions action = new Actions(driver);
		action.moveToElement(openFacility).doubleClick().build().perform();
	}

	public void clickSaveAndCloseBtn() {
		saveAndCloseBtn.click();
	}
}
