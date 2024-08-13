import { expect, Page, test } from "@playwright/test";

export class EditSpecialtyPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async updateSpecialtyTo(newSpecialty: string) {
        const editSpecialtyInput = this.page.locator('#name')
        await editSpecialtyInput.click()
        await editSpecialtyInput.clear()
        await editSpecialtyInput.fill(newSpecialty)
        await this.page.getByRole('button', { name: "Update" }).click()
    }
}