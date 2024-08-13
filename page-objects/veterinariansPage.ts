import { expect, Page, test } from "@playwright/test";

export class VeterinariansPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async validateSpecialtyForVeterinarian(veterinarianName: string, specialty: string) {
        const rafaelSpecialty = this.page.getByRole('row', { name: veterinarianName }).locator('td').nth(1)
        await expect(rafaelSpecialty).toContainText(specialty)
    }

    async selectEditButtonForVeterinarianWithName(name: string) {
        await this.page.locator("tr", { has: this.page.getByText(name) }).getByRole("button", { name: "Edit Vet" }).click();
    }

    async checkInputValueContain(expectedInputValue: string) {
        const selectedSpecialtiesDropdown = this.page.locator(".dropdown-display .selected-specialties");
        await expect(selectedSpecialtiesDropdown).toContainText(expectedInputValue);
        if (await this.page.locator(".dropdown-display").locator('..').getAttribute('class') !== 'dropdown show')
            await selectedSpecialtiesDropdown.click();
    }


}