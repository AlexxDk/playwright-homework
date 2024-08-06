import { expect, Page, test } from "@playwright/test";

export class SpecialtiesPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async specialtyUpdate(specialtyName: string) {
        const rowSurgery = this.page.locator('tr', { has: this.page.locator('[id="1"]') })
        await rowSurgery.getByRole("button", { name: "Edit" }).click();
        await expect(this.page.locator('h2')).toContainText('Edit Specialty')

        const editSpecialtyInput = this.page.locator('#name')
        await editSpecialtyInput.click()
        await editSpecialtyInput.clear()
        await editSpecialtyInput.fill(specialtyName)
        await this.page.getByRole('button', { name: "Update" }).click()
        await expect(rowSurgery.locator('td input').first()).toHaveValue(specialtyName)
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

    async editVetForSpecificVeterinarian(veterinarianName: string, specialtyItem: string, arrayOfAllSpecialties?: string[]) {
        const veterinarianRow = this.page.locator('tr', { has: this.page.getByText(veterinarianName) })
        await veterinarianRow.getByRole('button', { name: 'Edit Vet' }).click()

        await this.page.locator('.dropdown-display').click()
        const allValuesFromDropDownMenu = await this.page.locator(".dropdown-content label").allTextContents()

        expect(arrayOfAllSpecialties).toEqual(allValuesFromDropDownMenu)

        await this.page.getByLabel(specialtyItem).click()
        await this.page.locator('.selected-specialties').click()
        await this.page.getByRole('button', { name: 'Save Vet' }).click()
        await expect(veterinarianRow.locator('td').nth(1)).toContainText(specialtyItem)
    }

}