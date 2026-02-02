import { Given, When, Then, setDefaultTimeout} from "@cucumber/cucumber";
import {expect} from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";
import LoginPage from "../../pages/loginPage";
import AdminPage from "../../pages/adminPage";
import data from "../../helper/util/test-data/adminUser.json";

setDefaultTimeout(60000);

let loginPage: LoginPage;
let adminPage: AdminPage;


Given('User navigates to the application login page', async function () {
    loginPage = new LoginPage(fixture.page);
    await loginPage.navigateToLoginPage();
});

Given(/^User enter the username(?: as "(.+)")?$/, async function (username?: string) {
    const userToEnter = username || data.userName;
    await loginPage.enterUserName(userToEnter);
});

Given(/^User enter the password(?: as "(.+)")?$/, async function (password?: string) {
    const passwordToEnter = password || data.password;
    await loginPage.enterPassword(passwordToEnter);
});

When('User clear all input fields', async function () {
    await loginPage.clearAllFields();
});

When('User click on the login button', async function () {
    fixture.page.once('dialog', async (dialog) => {
        await dialog.accept();
    });
    await loginPage.clickLoginButton();
});

Then('Login should be success', async function () {
    adminPage = new AdminPage(fixture.page);
    const usernameDropdown = adminPage.getUsernameDropdown();
    await expect(usernameDropdown).toBeVisible({ timeout: 30000 });
});

Then('Login should fail with error message {string}', async function (expectedErrorMessage: string) {
    const errorMessage = loginPage.getErrorMessage();
    await expect(errorMessage).toContainText(expectedErrorMessage, { timeout: 10000 });
});
