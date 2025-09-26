package ca.bc.gov.ecc.ccof.pageobjects;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import ca.bc.gov.ecc.ccof.baseclass.BaseTest;

public class CRMSignInCredentialPage extends BaseTest {

	WebDriver driver;
	WebDriverWait wait;

	@FindBy(name = "loginfmt")
	WebElement text_userID;

	@FindBy(name = "passwd")
	WebElement text_password;

	@FindBy(id = "idSIButton9")
	WebElement button_next;

	@FindBy(id = "idSIButton9")
	WebElement button_signIn;

	@FindBy(id = "lightbox")
	WebElement form_lightbox;

	@FindBy(id = "idSIButton9")
	WebElement button_Yes;

	@FindBy(id = "okButton_1")
	WebElement button_SignInAgain;

	@FindBy(xpath = "//*[text()='Organization-Facilities']")
	WebElement button_OrgFacilities;

	@FindBy(xpath = "//*[text()='Assistance Requests']")
	WebElement buttonAssistanceRequest;

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
		WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(100));
		wait.until(ExpectedConditions.visibilityOf(headerPicture));
		headerPicture.click();
	}

	public void clickSignOut() {
		WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(100));
		wait.until(ExpectedConditions.visibilityOf(signOut));
		signOut.click();
	}

	public void wait(WebElement ele) {
		WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(60));
		wait.until(ExpectedConditions.visibilityOf(ele));
	}

	public void enterUserId(String userid) {
		WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(100));
		wait.until(ExpectedConditions.visibilityOf(text_userID));
		// wait(text_userID);
		text_userID.sendKeys(userid);
	}

	public void clickNext() {
		WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(100));
		wait.until(ExpectedConditions.visibilityOf(button_next));
		button_next.click();
	}

	public void enterPassword(String userPassword) {
		WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(100));
		wait.until(ExpectedConditions.visibilityOf(text_password));
		text_password.sendKeys(userPassword);
	}

	public void clickForm() {
		wait.until(ExpectedConditions.visibilityOf(form_lightbox)).click();
	}

	public void clickSignIn() {
		WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(100));
		wait.until(ExpectedConditions.visibilityOf(button_signIn));
		button_signIn.click();
	}

	public void clickYes() {
		wait(form_lightbox);
		form_lightbox.click();
		button_Yes.click();
	}

	public void clickSignInAgain() {
		wait.until(ExpectedConditions.visibilityOf(button_SignInAgain)).click();
	}

	public void clickOrgFacilities() {
		wait.until(ExpectedConditions.elementToBeClickable(button_OrgFacilities)).click();
	}

	public void clickAssistanceRequest() {
		wait.until(ExpectedConditions.elementToBeClickable(buttonAssistanceRequest)).click();
	}

	public void clickAccount() {
		wait.until(ExpectedConditions.elementToBeClickable(signInAccount)).click();
	}

	public void isLoginScreenAvailable() throws Exception {

		WebElement element = driver.findElement(By.xpath("//*[text()='Pick an account']"));

		if (element == null) {
			throw new Exception("Login page not present");
		}
	}

	// apps dashboard method

	public void switchToAppsDashboardIFrame() {
		WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(100));
		wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(appsDashboardIFrame));
		wait.until(ExpectedConditions.elementToBeClickable(selectCaseManagementSystem)).click();
		driver.switchTo().defaultContent();
	}

	// Invalid Login methods
	public String getInvalidLoginErrorMessage() {
		WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(100));
		wait.until(ExpectedConditions.visibilityOf(invalidLoginErrorMessage));
		return invalidLoginErrorMessage.getText();

	}

	public void signInApplication() throws InterruptedException {

		enterUserId(CRM_USERNAME);
		clickNext();
		enterPassword(CRM_PASSWORD);
		Thread.sleep(2000);
		clickSignIn();
		Thread.sleep(2000);
		clickYes();
		Thread.sleep(5000);
		clickSignInAgain();
		Thread.sleep(5000);
		switchToAppsDashboardIFrame();
		Thread.sleep(2000);

	}
}
