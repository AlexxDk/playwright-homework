import { expect, Page, test } from "@playwright/test";

export class SpecialtiesPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async selectEditSpecialtyByIndex(index: number) {
        const rowSurgery = this.page.locator('tr', { has: this.page.locator(`[id="${index}"]`) })
        await rowSurgery.getByRole("button", { name: "Edit" }).click();
        await expect(this.page.locator('h2')).toContainText('Edit Specialty')
    }

    async validateRowSpecialtyValueByIndex(index: number, specialtyName: string) {
        await expect(this.page.locator('tr', { has: this.page.locator(`[id="${index}"]`) }).locator('td input').first()).toHaveValue(specialtyName)
    }

    async addNewSpecialty(newSpecialty: string) {
        await this.page.getByRole('button', { name: "Add" }).click()
        await this.page.locator('#name').fill(newSpecialty)
        await this.page.getByRole('button', { name: "Save" }).click()
        await this.page.waitForResponse('https://petclinic-api.bondaracademy.com/petclinic/api/specialties')

    }

    async listOfAllSpecialties() {
        const allSpecialtiesValues = this.page.locator('td input')
        let specialtiesList: string[] = []

        for (const specialty of await allSpecialtiesValues.all()) {
            specialtiesList.push(await specialty.inputValue())
        }
        return specialtiesList
    }

    async deleteLastSpecialty(){
        await this.page.locator('tbody tr').last().getByRole('button', { name: "Delete" }).click()
    }
}