import { Page } from "@playwright/test";

export default class PlaywrightWrapper {

    constructor(private page: Page) { }

    async goto(url: string) {
        await this.page.goto(url, {
            waitUntil: "domcontentloaded"
        });
    }

    async waitAndClick(locator: string, timeout: number = 30000) {
        const element = this.page.locator(locator);
        await element.waitFor({
            state: "visible",
            timeout: timeout
        });
        await element.click({ timeout: timeout });
    }

    async navigateTo(link: string) {
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.click(link)
        ])
    }

}