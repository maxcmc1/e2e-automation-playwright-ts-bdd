import { Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";


export default class LoginPage {
    private base: PlaywrightWrapper
    constructor(private page: Page) {
        this.base = new PlaywrightWrapper(page);
    }

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

    async clearAllFields() {
        await this.page.locator(this.Elements.userInput).clear();
        await this.page.locator(this.Elements.passwordInput).clear();
    }

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