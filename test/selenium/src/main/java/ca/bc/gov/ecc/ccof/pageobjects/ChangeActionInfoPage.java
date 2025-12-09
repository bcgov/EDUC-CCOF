package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ChangeActionInfoPage {

	WebDriverWait wait;
	WebDriver driver;

	@FindBy(xpath = "//*[@aria-label='select or deselect the row']")
	WebElement selectNewFacilityRow;

	@FindBy(xpath = "//*[@aria-label='select or deselect the row']")
	WebElement selectMTFIRow;

	@FindBy(xpath = "//*[@aria-label='Save & Close']")
	WebElement saveAndCloseBtn;

	public ChangeActionInfoPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void clickSaveAndCloseBtn() {
		saveAndCloseBtn.click();
	}

	public void clickNewFacilityRow() {
		Actions action = new Actions(driver);
		action.moveToElement(selectNewFacilityRow).doubleClick().build().perform();
	}

	public void clickMTFIRow() {
		Actions action = new Actions(driver);
		action.moveToElement(selectMTFIRow).doubleClick().build().perform();
	}
}
