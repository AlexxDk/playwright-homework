import { expect, Page, test } from "@playwright/test";

export class VeterinariansPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    /**
     * 
     * @param veterinarianName 
     * @param specialty - specialtyName or 'empty' if need to check that veterinarian does not have specialties assigned
     */
    async validateSpecialtyForVeterinarian(veterinarianName: string, specialty: string) {
        const specialtyRow = this.page.getByRole('row', { name: veterinarianName }).locator('td').nth(1)
        if (specialty == 'empty') {
            await expect(this.page.locator('tr', { has: this.page.getByText(veterinarianName) }).locator('td').nth(1)).toBeEmpty()
        } else {
            await expect(specialtyRow).toContainText(specialty)
        }
    }

    async selectEditVetByName(veterinarianName: string) {
        await this.page.locator('tr', { has: this.page.getByText(veterinarianName) }).getByRole('button', { name: 'Edit Vet' }).click()
    }

    async validateSpecialtiesCountByVeterinarianName(VeterinarianName: string, SpecialtiesCount: number) {
        await expect(this.page.locator('tr', { has: this.page.getByText(VeterinarianName) })
            .locator('td').nth(1).locator('div')).toHaveCount(SpecialtiesCount)
    }
}