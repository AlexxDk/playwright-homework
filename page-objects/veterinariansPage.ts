import { expect, Page, test } from "@playwright/test";

export class VeterinariansPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async validateSpecialtyForVeterinarian(veterinarianName: string, specialty: string) {
        const specialtyRow = this.page.getByRole('row', { name: veterinarianName }).locator('td').nth(1)
        if (specialty == 'empty') {
            await expect(this.page.locator('tr', { has: this.page.getByText(veterinarianName) }).locator('td').nth(1)).toBeEmpty()
        } else {
            await expect(specialtyRow).toContainText(specialty)
        }
    }

    async selectEditButtonForVeterinarianWithName(name: string) {
        await this.page.locator("tr", { has: this.page.getByText(name) }).getByRole("button", { name: "Edit Vet" }).click();
    }
    
    async selectEditVetByName(veterinarianName: string) {
        const veterinarianRow = this.page.locator('tr', { has: this.page.getByText(veterinarianName) })
        await veterinarianRow.getByRole('button', { name: 'Edit Vet' }).click()
    }
}