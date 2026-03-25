package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class CRMSignInCredentialPage {

	WebDriverWait wait;
	WebDriver driver;

	@FindBy(name = "loginfmt")
	WebElement userIdField;

	@FindBy(name = "passwd")
	WebElement passwordField;

	@FindBy(id = "idSIButton9")
	WebElement nextBtn;

	@FindBy(id = "idSIButton9")
	WebElement signInBtn;

	@FindBy(id = "lightbox")
	WebElement lightboxForm;

	@FindBy(id = "idSIButton9")
	WebElement yesBtn;

	@FindBy(id = "okButton_1")
	WebElement signInAgainBtn;

	@FindBy(xpath = "//*[text()='Organization-Facilities']")
	WebElement orgFacilitiesBtn;

	@FindBy(xpath = "//*[text()='Assistance Requests']")
	WebElement assistanceRequestBtn;

	@FindBy(xpath = "//*[@aria-label[contains(., 'Sign in with')]]")
	WebElement signInAccount;

	@FindBy(xpath = "//*[@id='mectrl_headerPicture']")
	WebElement headerPicture;

	@FindBy(xpath = "//*[@id='mectrl_body_signOut']")
	WebElement signOut;

	// Apps dashboard

	@FindBy(xpath = "//iframe[@id='AppLandingPage']")
	WebElement appsDashboardIFrame;

	@FindBy(xpath = "//div[@title='Case Management System']")
	WebElement selectCaseManagementSystem;

	// Invalid login elements
	@FindBy(xpath = "//div[@id='passwordError']")
	WebElement invalidLoginErrorMessage;

	public CRMSignInCredentialPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));

	}

	public void clickHeaderPicture() {
		headerPicture.click();
	}

	public void clickSignOut() {
		signOut.click();
	}

	public void enterUserId(String userid) {
		userIdField.sendKeys(userid);
	}

	public WebElement waitBeforeEnterUserId() {
		return userIdField;
	}

	public void clickNext() {
		nextBtn.click();
	}

	public void enterPassword(String userPassword) {
		passwordField.sendKeys(userPassword);
	}

	public WebElement waitBeforePasswordEntered() {
		return passwordField;
	}

	public void clickForm() {
		lightboxForm.click();
	}

	public void clickSignIn() {
		signInBtn.click();
	}

	public WebElement waitBeforeClickSignIn() {
		return signInBtn;
	}

	public WebElement displaySignIn() {
		return signInBtn;
	}

	public void clickYes() {
		lightboxForm.click();
		yesBtn.click();
	}

	public WebElement waitBeforeClickYes() {
		return yesBtn;
	}

	public void clickSignInAgain() {
		signInAgainBtn.click();
	}

	public WebElement waitBeforeClickSignInAgain() {
		return signInAgainBtn;
	}

	public void clickOrgFacilities() {
		orgFacilitiesBtn.click();
	}

	public WebElement waitBeforeClickOrgFacilities() {
		return orgFacilitiesBtn;
	}

	public void clickAssistanceRequest() {
		assistanceRequestBtn.click();
	}

	public void clickAccount() {
		signInAccount.click();
	}

	// apps dashboard method
	public void switchToAppsDashboardIFrame() {
		wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(appsDashboardIFrame));
		wait.until(ExpectedConditions.elementToBeClickable(selectCaseManagementSystem)).click();
		driver.switchTo().defaultContent();
	}

	// Invalid Login methods
	public String getInvalidLoginErrorMessage() {
		wait.until(ExpectedConditions.visibilityOf(invalidLoginErrorMessage));
		return invalidLoginErrorMessage.getText();

	}

}
