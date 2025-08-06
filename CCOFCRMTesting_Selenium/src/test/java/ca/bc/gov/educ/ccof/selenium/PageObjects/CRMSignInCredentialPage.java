package ca.bc.gov.educ.ccof.selenium.PageObjects;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class CRMSignInCredentialPage {
	
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
	
	@FindBy(xpath = "\"//*[text()='Assistance Requests']\"")
	WebElement buttonAssistanceRequest;
	
	@FindBy(xpath = "//*[@aria-label[contains(., 'Sign in with')]]")
	WebElement signInAccount;
	
	public CRMSignInCredentialPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void enterUserId(String userid) {
		text_userID.sendKeys(userid);
	}

	public void clickNext() {
		button_next.click();
	}

	public void enterPassword(String userPassword) {
		text_password.sendKeys(userPassword);
	}

	public void clickForm() {
		wait.until(ExpectedConditions.visibilityOf(form_lightbox)).click();
	}

	public void clickSignIn() {
		button_signIn.click();
	}

	public void clickYes() {
		wait.until(ExpectedConditions.visibilityOf(form_lightbox));
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

	

}
