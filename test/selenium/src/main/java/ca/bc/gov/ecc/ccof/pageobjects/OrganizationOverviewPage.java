package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class OrganizationOverviewPage {

	WebDriverWait wait;
	WebDriver driver;

	// Org Overview dropdown field
	@FindBy(xpath = "//*[@aria-label='Organization-Facility entity, Organization Overview']")
	WebElement orgOverviewDropdown;

	// Dropdown options list
	@FindBy(xpath = "//*[@data-id='form-selector-item-form-selector-1']")
	WebElement orgInformationOption;

	public OrganizationOverviewPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void clickOrgInformation() {
		// if already on Organization Information, no need to switch
		List<WebElement> alreadySelected = driver.findElements(
				By.xpath("//*[@aria-label='Organization-Facility entity, Organization Information']"));
		if (!alreadySelected.isEmpty()) {
			return;
		}

        wait.until(ExpectedConditions.elementToBeClickable(orgOverviewDropdown));
		orgOverviewDropdown.click();
		wait.until(ExpectedConditions.elementToBeClickable(orgInformationOption));
		orgInformationOption.click();
	}
}

