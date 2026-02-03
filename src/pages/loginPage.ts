import { Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";


export default class LoginPage {
    private base: PlaywrightWrapper
    constructor(private page: Page) {
        this.base = new PlaywrightWrapper(page);
    }

    // CSS and XPath selectors for login page elements
    private Elements = {
        userInput: "input[placeholder='Username']",
        passwordInput: "input[placeholder='Password']",
        loginBtn: "button[type='submit']"
    }

    async navigateToLoginPage() {
        await this.base.goto(process.env.BASEURL);
    }
    async enterUserName(user: string) {
        await this.page.locator(this.Elements.userInput).fill(user);
    }
    async enterPassword(Password: string) {
        await this.page.locator(this.Elements.passwordInput).fill(Password);
    }

    /**
     * Clears all input fields on the login page
     * Useful for resetting form state between test steps
     */
    async clearAllFields() {
        await this.page.locator(this.Elements.userInput).clear();
        await this.page.locator(this.Elements.passwordInput).clear();
    }

    /**
     * Clicks the login button
     * Uses wrapper method that includes wait logic for element visibility
     */
    async clickLoginButton() {
        await this.base.waitAndClick(this.Elements.loginBtn);
    }

    getErrorMessage() {
        return this.page.getByRole("alert");
    }

    async loginUser(user: string, password: string) {
        await this.enterUserName(user);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }
}