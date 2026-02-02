import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";
import PimEmployeeListPage from "../../pages/pimEmployeeListPage";
import PimAddEmployeePage from "../../pages/pimAddEmployeePage";
import PimEmployeePersonalDetailsPage from "../../pages/pimEmployeePersonalDetailsPage";
import AdminPage from "../../pages/adminPage";
import LoginPage from "../../pages/loginPage";
import employeeData from "../../helper/util/test-data/employeeData.json";

let pimEmployeeListPage: PimEmployeeListPage;
let pimAddEmployeePage: PimAddEmployeePage;
let pimEmployeePersonalDetailsPage: PimEmployeePersonalDetailsPage;
let adminPage: AdminPage;

function generateRandom4Digits(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function appendRandomDigitsToLastName(lastName: string): string {
    const randomDigits = generateRandom4Digits();
    return `${lastName}${randomDigits}`;
}

Given('User navigates to PIM Add Employee page', async function () {
    pimEmployeeListPage = new PimEmployeeListPage(fixture.page);
    await pimEmployeeListPage.navigateToEmployeeList();
    await pimEmployeeListPage.clickAddEmployeeButton();
    pimAddEmployeePage = new PimAddEmployeePage(fixture.page);
});

When(/^User enters new employee details(?: with first name "(.+)" and last name "(.+)")?$/, async function (firstName?: string, lastName?: string) {
    const firstNameToEnter = firstName || employeeData.firstName;
    const baseLastName = lastName || employeeData.lastName;
    const lastNameToEnter = appendRandomDigitsToLastName(baseLastName);
    
    this.lastNameWithDigits = lastNameToEnter;
    
    await pimAddEmployeePage.enterFirstName(firstNameToEnter);
    await pimAddEmployeePage.enterLastName(lastNameToEnter);
    
    const firstNameInput = pimAddEmployeePage.getFirstNameInput();
    const lastNameInput = pimAddEmployeePage.getLastNameInput();
    
    await expect(firstNameInput).toHaveValue(firstNameToEnter, { timeout: 5000 });
    await expect(lastNameInput).toHaveValue(lastNameToEnter, { timeout: 5000 });
    
    const randomEmployeeId = generateRandom4Digits();
    await pimAddEmployeePage.enterEmployeeId(randomEmployeeId);
    
    await pimAddEmployeePage.clickCreateLoginDetailsToggle();
    
    const randomDigits = generateRandom4Digits();
    const usernameToEnter = `rsmith${randomDigits}`;
    this.username = usernameToEnter;
    
    await pimAddEmployeePage.enterUsername(usernameToEnter);
    await pimAddEmployeePage.enterPassword(employeeData.password);
    await pimAddEmployeePage.enterConfirmPassword(employeeData.password);
    
    await pimAddEmployeePage.clickSaveButton();
});

Then('Employee personal details page should load', async function () {
    pimEmployeePersonalDetailsPage = new PimEmployeePersonalDetailsPage(fixture.page);
    await pimEmployeePersonalDetailsPage.verifyEmployeePersonalDetailsPageLoaded();
});

When('User searches for new employee', async function () {
    const fullName = `${employeeData.firstName} ${this.lastNameWithDigits}`;

    pimEmployeeListPage = new PimEmployeeListPage(fixture.page);
    await pimEmployeeListPage.navigateToEmployeeList();
    await pimEmployeeListPage.clickEmployeeListTab();
    await pimEmployeeListPage.searchEmployeeByName(fullName);
    await pimEmployeeListPage.waitForEmployeeByLastName(this.lastNameWithDigits);
});

When('User logs out', async function () {
    adminPage = new AdminPage(fixture.page);
    await adminPage.logout();
});

When('User logs in with newly created employee credentials', async function () {
    const employeeUsername = this.username;
    const employeePassword = employeeData.password;
    
    if (!employeeUsername) {
        throw new Error('Employee username not found. Make sure "User enters new employee details" step was executed first.');
    }
    
    const loginPage = new LoginPage(fixture.page);
    this.loginPage = loginPage;
    
    await loginPage.navigateToLoginPage();
    await loginPage.enterUserName(employeeUsername);
    await loginPage.enterPassword(employeePassword);
    
    fixture.page.once('dialog', async (dialog) => {
        await dialog.accept();
    });
    
    await loginPage.clickLoginButton();
});

When('User removes the employee from the system', async function () {
    await pimEmployeeListPage.clickTrashButtonAndWaitForDelete();
});

Then('Login should fail with error message {string} for deleted employee', async function (expectedErrorMessage: string) {
    const loginPage: LoginPage = this.loginPage;
    
    if (!loginPage) {
        throw new Error('LoginPage not found. Make sure "User logs in with newly created employee credentials" step was executed first.');
    }
    
    const errorMessage = loginPage.getErrorMessage();
    await expect(errorMessage).toContainText(expectedErrorMessage, { timeout: 10000 });
});