package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ChangeActionNewFacilityPage {

	WebDriverWait wait;
	WebDriver driver;

	@FindBy(xpath = "//*[@data-id='ccof_facility.fieldControl-LookupResultsDropdown_ccof_facility_selected_tag']")
	WebElement newFacilityField;

	@FindBy(xpath = "//*[@aria-label='Save & Close']")
	WebElement saveAndCloseBtn;

	public ChangeActionNewFacilityPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void clickNewFacilityField() {
		newFacilityField.click();
	}

	public void clickSaveAndCloseBtn() {
		saveAndCloseBtn.click();
	}
}
