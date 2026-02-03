import { Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";


export default class PimAddEmployeePage {
    private base: PlaywrightWrapper
    constructor(private page: Page) {
        this.base = new PlaywrightWrapper(page);
    }

    // CSS and XPath selectors for add employee form elements
    private Elements = {
        firstNameInput: "input[placeholder='First Name']",
        lastNameInput: "input[placeholder='Last Name']",
        employeeIdInput: "//label[text()='Employee Id']/../..//input",
        saveButton: "button[type='submit']",
        createLoginToggle: ".oxd-switch-input.oxd-switch-input--active.--label-right",
        usernameInput: "//label[text()='Username']/../..//input",
        passwordInput: "//label[text()='Password']/../..//input",
        confirmPasswordInput: "//label[text()='Confirm Password']/../..//input"
    }

    async navigateToAddEmployee() {
        const baseUrl = process.env.BASEURL?.replace('/web/index.php/auth/login', '') || '';
        await this.base.goto(`${baseUrl}/web/index.php/pim/addEmployee`);
    }

    async enterFirstName(firstName: string) {
        const firstNameInput = this.page.locator(this.Elements.firstNameInput);
        await firstNameInput.waitFor({ state: 'visible', timeout: 30000 });
        await firstNameInput.fill(firstName);
    }

    async enterLastName(lastName: string) {
        const lastNameInput = this.page.locator(this.Elements.lastNameInput);
        await lastNameInput.waitFor({ state: 'visible', timeout: 30000 });
        await lastNameInput.fill(lastName);
    }

    getFirstNameInput() {
        return this.page.locator(this.Elements.firstNameInput);
    }

    getLastNameInput() {
        return this.page.locator(this.Elements.lastNameInput);
    }

    async enterEmployeeId(employeeId: string) {
        const employeeIdInput = this.page.locator(this.Elements.employeeIdInput);
        await employeeIdInput.waitFor({ state: 'visible', timeout: 30000 });
        await employeeIdInput.clear();
        await employeeIdInput.fill(employeeId);
    }

    async clickCreateLoginDetailsToggle() {
        const toggle = this.page.locator(this.Elements.createLoginToggle);
        await toggle.waitFor({ state: 'visible', timeout: 30000 });
        await this.base.waitAndClick(this.Elements.createLoginToggle);
    }

    async enterUsername(username: string) {
        const usernameInput = this.page.locator(this.Elements.usernameInput);
        await usernameInput.waitFor({ state: 'visible', timeout: 30000 });
        await usernameInput.fill(username);
    }

    async enterPassword(password: string) {
        const passwordInput = this.page.locator(this.Elements.passwordInput);
        await passwordInput.waitFor({ state: 'visible', timeout: 30000 });
        await passwordInput.fill(password);
    }

    async enterConfirmPassword(password: string) {
        const confirmPasswordInput = this.page.locator(this.Elements.confirmPasswordInput);
        await confirmPasswordInput.waitFor({ state: 'visible', timeout: 30000 });
        await confirmPasswordInput.fill(password);
    }

    async clickSaveButton() {
        const saveButton = this.page.locator(this.Elements.saveButton);
        await saveButton.waitFor({ state: 'visible', timeout: 30000 });
        await this.base.waitAndClick(this.Elements.saveButton);
    }

    verifyAddEmployeePageLoaded() {
        return this.page.url().includes('/pim/addEmployee');
    }
}
