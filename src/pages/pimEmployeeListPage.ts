import { Page, expect } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";


export default class PimEmployeeListPage {
    private base: PlaywrightWrapper
    constructor(private page: Page) {
        this.base = new PlaywrightWrapper(page);
    }

    private Elements = {
        addButton: "button[class='oxd-button oxd-button--medium oxd-button--secondary']",
        employeeListTab: "//a[text()='Employee List']",
        employeeNameInput: "//label[text()='Employee Name']/../..//input",
        searchButton: "button[type='submit']",
        trashButton: ".oxd-icon.bi-trash",
        deleteButton: "//button[text()=' Yes, Delete ']"
    }

    async clickAddEmployeeButton() {
        await this.base.waitAndClick(this.Elements.addButton);
    }

    async clickEmployeeListTab() {
        await this.base.waitAndClick(this.Elements.employeeListTab);
    }

    async navigateToEmployeeList() {
        const baseUrl = process.env.BASEURL?.replace('/web/index.php/auth/login', '') || '';
        await this.base.goto(`${baseUrl}/web/index.php/pim/viewEmployeeList`);
    }

    async searchEmployeeByName(fullName: string) {
        const employeeNameInput = this.page.locator(this.Elements.employeeNameInput);
        await employeeNameInput.waitFor({ state: 'visible', timeout: 30000 });
        await employeeNameInput.fill(fullName);
        
        const searchButton = this.page.locator(this.Elements.searchButton);
        await searchButton.waitFor({ state: 'visible', timeout: 30000 });
        await searchButton.click();
    }

    async waitForEmployeeByLastName(lastNameWithDigits: string) {
        const employeeElement = this.page.locator(`//div[text()='${lastNameWithDigits}']`);
        await expect(employeeElement).toBeVisible({ timeout: 30000 });
    }

    async clickTrashButtonAndWaitForDelete() {
        const trashButton = this.page.locator(this.Elements.trashButton);
        await trashButton.waitFor({ state: 'visible', timeout: 30000 });
        await trashButton.click();
        
        const deleteButton = this.page.locator(this.Elements.deleteButton);
        await expect(deleteButton).toBeVisible({ timeout: 30000 });
        await deleteButton.click();
    }
}
