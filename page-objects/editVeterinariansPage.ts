import { expect, Page, test } from "@playwright/test";

export class EditVeterinariansPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async checkInputValueContain(expectedInputValue: string) {
        const selectedSpecialtiesDropdown = this.page.locator(".dropdown-display .selected-specialties");
        await expect(selectedSpecialtiesDropdown).toContainText(expectedInputValue);
        if (await this.page.locator(".dropdown-display").locator('..').getAttribute('class') !== 'dropdown show')
            await selectedSpecialtiesDropdown.click();
    }
}