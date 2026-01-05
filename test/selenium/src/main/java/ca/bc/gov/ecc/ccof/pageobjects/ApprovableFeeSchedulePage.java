package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ApprovableFeeSchedulePage {
	WebDriverWait wait;
	WebDriver driver;

	@FindBy(xpath = "//*[@aria-label='APR']")
	WebElement aprField;

	@FindBy(xpath = "//*[@aria-label='MAY']")
	WebElement mayField;

	@FindBy(xpath = "//*[@aria-label='JUN']")
	WebElement junField;

	@FindBy(xpath = "//*[@aria-label='JUL']")
	WebElement julField;

	@FindBy(xpath = "//*[@aria-label='AUG']")
	WebElement augField;

	@FindBy(xpath = "//*[@aria-label='SEP']")
	WebElement sepField;

	@FindBy(xpath = "//*[@aria-label='OCT']")
	WebElement octField;

	@FindBy(xpath = "//*[@aria-label='NOV']")
	WebElement novField;

	@FindBy(xpath = "//*[@aria-label='DEC']")
	WebElement decField;

	@FindBy(xpath = "//*[@aria-label='JAN']")
	WebElement janField;

	@FindBy(xpath = "//*[@aria-label='FEB']")
	WebElement febField;

	@FindBy(xpath = "//*[@aria-label='MAR']")
	WebElement marField;

	public ApprovableFeeSchedulePage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	// methods can be added here

	public WebElement enterAprFee() {
		return aprField;
	}

	public WebElement enterMayFee() {
		return mayField;
	}

	public WebElement enterJunFee() {
		return junField;
	}

	public WebElement enterJulFee() {
		return julField;
	}

	public WebElement enterAugFee() {
		return augField;

	}

	public WebElement enterSepFee() {
		return sepField;
	}

	public WebElement enterOctFee() {
		return octField;

	}

	public WebElement enterNovFee() {
		return novField;

	}

	public WebElement enterDecFee() {
		return decField;

	}

	public WebElement enterJanFee() {
		return janField;

	}

	public WebElement enterFebFee() {
		return febField;

	}

	public WebElement enterMarFee() {
		return marField;

	}
}
