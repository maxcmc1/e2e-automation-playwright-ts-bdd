import { Page, expect } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";


export default class AdminPage {
    private base: PlaywrightWrapper
    constructor(private page: Page) {
        this.base = new PlaywrightWrapper(page);
    }

    private Elements = {
        usernameDropdown: ".oxd-userdropdown-tab",
        logoutButton: "//a[text()='Logout']",
        userDisplayName: "//p[@class='oxd-userdropdown-name']"
    }

    getUsernameDropdown() {
        return this.page.locator(this.Elements.usernameDropdown);
    }

    async clickUsernameDropdown() {
        const usernameDropdown = this.getUsernameDropdown();
        await usernameDropdown.waitFor({ state: 'visible', timeout: 30000 });
        await usernameDropdown.click();
    }

    async clickLogoutButton() {
        const logoutButton = this.page.locator(this.Elements.logoutButton);
        await logoutButton.waitFor({ state: 'visible', timeout: 30000 });
        await logoutButton.click();
    }

    async logout() {
        await this.clickUsernameDropdown();
        await this.clickLogoutButton();
    }

    async expectLoggedInUser(expectedFullName: string) {
        const userDisplayName = this.page.locator(this.Elements.userDisplayName);
        await expect(userDisplayName).toHaveText(expectedFullName, { timeout: 30000 });
    }
}