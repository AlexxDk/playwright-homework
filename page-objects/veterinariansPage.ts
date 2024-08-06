import { expect, Page, test } from "@playwright/test";

export class VeterinariansPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async validateSpecialtyForVeterinarian(veterinarianName: string, specialty: string ) {
        const rafaelSpecialty = this.page.getByRole('row', { name: veterinarianName }).locator('td').nth(1)
        await expect(rafaelSpecialty).toContainText(specialty)
    }

    
    
}