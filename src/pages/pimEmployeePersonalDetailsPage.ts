import { Page, expect } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";


export default class PimEmployeePersonalDetailsPage {
    private base: PlaywrightWrapper
    constructor(private page: Page) {
        this.base = new PlaywrightWrapper(page);
    }

    // CSS selector for employee full name label element
    private Elements = {
        employeeFullNameLabel: ".oxd-label.oxd-input-field-required:has-text('Employee Full Name')"
    }

    async waitForPersonalDetailsPage() {
        await this.page.waitForURL('**/viewPersonalDetails**', { timeout: 30000 });
    }

    async verifyEmployeeFullNameLabelIsVisible() {
        const employeeFullNameLabel = this.page.locator(this.Elements.employeeFullNameLabel);
        await expect(employeeFullNameLabel).toBeVisible({ timeout: 30000 });
        return employeeFullNameLabel;
    }

    async verifyEmployeePersonalDetailsPageLoaded() {
        await this.waitForPersonalDetailsPage();
        await this.verifyEmployeeFullNameLabelIsVisible();
        return true;
    }
}
