package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

public class CcfriUnlockForm {
	WebDriverWait wait;
	WebDriver driver;

	@FindBy(xpath = "//*[@data-container-name='Container CCFRI-container']//div[@data-control-name='tg_unlock_declaration']//button[contains(@id,'Toggle')]")
	WebElement declarationUnlockBtn;

	@FindBy(xpath = "//*[@data-container-name='Container CCCFRI Unlock-container']//div[@data-control-name='tg_unlock_CCOF']//button[contains(@id,'Toggle')]")
	WebElement ccofNewOrgBtn;

	@FindBy(xpath = "//*[@data-container-name='Container CCCFRI Unlock-container']//div[@data-control-name='tg_unlock_licence_upload']//button[contains(@id,'Toggle')]")
	WebElement licenceUploadBtn;

	@FindBy(xpath = "//*[@data-container-name='Container CCCFRI Unlock-container']//*[@data-control-name='tg_unlock_ECEWE']//button[contains(@id,'Toggle')]")
	WebElement eceweBtn;

	@FindBy(xpath = "//*[@data-container-name='Container CCCFRI Unlock-container']//*[@data-control-name='tg_unlock_supporting_document']//button[contains(@id,'Toggle')]")
	WebElement supportingDocBtn;

	@FindBy(xpath = "//*[@data-container-name='CCFRI Facilities Gallery-container']//*[@data-control-name='tg_unlock_CCFRI']//button[contains(@id,'Toggle')]")
	WebElement ccfriUnlockBtn;

	@FindBy(xpath = "//*[@data-container-name='CCFRI Facilities Gallery-container']//*[@data-control-name='tg_unlock_RFI']//button[contains(@id,'Toggle')]")
	WebElement rfiUnlockBtn;

	@FindBy(xpath = "//*[@data-container-name='CCFRI Facilities Gallery-container']//*[@data-control-name='tg_unlock_NMF']//button[contains(@id,'Toggle')]")
	WebElement nmfUnlockBtn;

	@FindBy(xpath = "//*[@placeholder='Please enter an unlock reason']")
	WebElement unlockReasonTxtBox;

	@FindBy(xpath = "//span[normalize-space()='Confirm & Close']")
	WebElement confirmAndCloseBtn;

	public CcfriUnlockForm(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public WebElement clickDeclarationUnlockBtn() {
		return declarationUnlockBtn;
	}

	public WebElement clickCcofNewOrgBtn() {
		return ccofNewOrgBtn;
	}

	public WebElement clickLicenceUploadBtn() {
		return licenceUploadBtn;
	}

	public WebElement clickEceweBtn() {
		return eceweBtn;
	}

	public WebElement clickSupportingDocBtn() {
		return supportingDocBtn;
	}

	public WebElement clickCcfriUnlockBtn() {
		return ccfriUnlockBtn;
	}

	public WebElement clickRfiUnlockBtn() {
		return rfiUnlockBtn;
	}

	public WebElement clickNmfUnlockBtn() {
		return nmfUnlockBtn;
	}

	public void enterUnlockReasonTxtBox(String value) {
		unlockReasonTxtBox.sendKeys(value);
	}

	public WebElement clickConfirmAndCloseBtn() {
		return confirmAndCloseBtn;
	}

}
