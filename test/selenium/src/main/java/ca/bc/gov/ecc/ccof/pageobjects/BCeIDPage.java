package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

public class BCeIDPage {

	WebDriverWait wait;
	WebDriver driver;

	@FindBy(xpath = "//*[@data-id='parentcustomerid.fieldControl-LookupResultsDropdown_parentcustomerid_selected_tag_text']")
	WebElement selectOrganization;

	public BCeIDPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void clickSelectOrganization() {
		selectOrganization.click();
	}

	public WebElement waitBeforeClickSelectOrganization() {
		return selectOrganization;
	}

}
