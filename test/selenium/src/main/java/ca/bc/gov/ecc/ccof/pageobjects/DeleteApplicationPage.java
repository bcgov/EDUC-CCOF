package ca.bc.gov.ecc.ccof.pageobjects;

import java.awt.Robot;
import java.awt.event.KeyEvent;
import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class DeleteApplicationPage {
	WebDriver driver;
	WebDriverWait wait;
	String getV;

	@FindBy(xpath = "//*[@id='GlobalSearchBox']")
	WebElement searchBox;

	@FindBy(xpath = "//*[@data-id='parentcustomerid.fieldControl-LookupResultsDropdown_parentcustomerid_selected_tag_delete']")
	WebElement cancelBtn;

	@FindBy(xpath = "(//*[@data-icon-name='CheckMark'])[2]")
	WebElement selectIdCheckBox;

	@FindBy(xpath = "(//button[@title='More commands for BCeID Organization']//*[contains(@class,'symbolFont MoreVertical-symbol pa-')])[1]")
	WebElement threeDotsbtn;

	@FindBy(xpath = "//li/ul/li[2]/button/span")
	WebElement deactivateBtn;

	@FindBy(xpath = "//button[@title= 'Deactivate']")
	WebElement deactivateBtnPopup;

	@FindBy(xpath = "//li/ul/li[3]/button/span")
	WebElement deleteBtn;

	@FindBy(xpath = "//button[@title= 'Delete']")
	WebElement deleteBtnPopup;

	@FindBy(xpath = "//*[contains(text(),'Save & Close')]")
	WebElement saveAndCloseBtn;

	@FindBy(xpath = "//*[@title= 'Ignore and save']")
	WebElement ignoreAndSaveBtn;

	public DeleteApplicationPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void mouseOverDeactivate() throws InterruptedException {
		Actions action = new Actions(driver);
		action.moveToElement(deactivateBtn).click().build().perform();
		Thread.sleep(5000);
	}

	public void mouseOverDelete() throws InterruptedException {
		Actions action = new Actions(driver);
		action.moveToElement(deleteBtn).click().build().perform();

	}

	public void cancelBtn() {
		WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(100));
		wait.until(ExpectedConditions.visibilityOf(cancelBtn));
		cancelBtn.click();
	}

	public void searchBox(String value) {
		searchBox.sendKeys(value);
		getV = getVsearchBox();
	}

	public String getVsearchBox() {
		return searchBox.getAttribute("value");
	}

	public void pressEnter() throws Throwable {
		Robot robot = new Robot();
		robot.keyPress(KeyEvent.VK_ENTER);
		robot.keyRelease(KeyEvent.VK_ENTER);
	}

	public void fullName() {
		WebElement fullName = driver.findElement(By.xpath("//*[contains(@title,'" + getV + "')]"));
		fullName.click();
	}

	public String searchBoxN(String value) {
		searchBox.sendKeys(value);
		return value;
	}

	public void selectIdCheckBox() {
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
		selectIdCheckBox.click();
	}

	public void threeDotsBtn() {
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
		threeDotsbtn.click();
	}

	public void deactivateBtn() {
		WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(100));
		wait.until(ExpectedConditions.visibilityOf(deactivateBtn));
		deactivateBtn.click();
	}

	public void deactivateBtnPopup() {
		WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(100));
		wait.until(ExpectedConditions.visibilityOf(deactivateBtnPopup));
		deactivateBtnPopup.click();
	}

	public void deleteBtnPopup() {
		deleteBtnPopup.click();
	}

	public void saveAndCloseBtn() {
		saveAndCloseBtn.click();
	}

	public void ignoreAndSaveBtn() {
		ignoreAndSaveBtn.click();
	}
}
