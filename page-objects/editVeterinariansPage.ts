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

    async updateVetTo(specialtyItem: string, arrayOfAllSpecialties?: string[]) {
        await this.page.locator('.dropdown-display').click()
        const allValuesFromDropDownMenu = await this.page.locator(".dropdown-content label").allTextContents()

        expect(arrayOfAllSpecialties).toEqual(allValuesFromDropDownMenu)

        await this.page.getByLabel(specialtyItem).click()
        await this.page.locator('.selected-specialties').click()
        await this.page.getByRole('button', { name: 'Save Vet' }).click()
    }
}