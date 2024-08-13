import { expect, Page, test } from "@playwright/test";

export class OwnerInformationPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async openFormAddNewPetForOwner(ownerName: string) {
        await this.page.getByRole('link', { name: ownerName }).click()
        await this.page.getByRole('button', { name: 'Add New Pet' }).click()
    }

    async addNewPet(name: string, birthDay: string, birthMonth: string, birthYear: string, type: string) {
        const icon = this.page.locator('span.glyphicon.form-control-feedback').first()
        await expect(icon).toHaveClass(/glyphicon-remove/)
        await this.page.locator('#name').fill(name)
        await expect(icon).toHaveClass(/glyphicon-ok/);

        await this.page.getByLabel('Open calendar').click();

        const dateToAssert = `${birthYear}/${birthMonth}/${birthDay}`

        await this.page.getByLabel('Choose month and year').click()
        await this.page.getByLabel('Previous 24 years').click()
        await this.page.getByRole('button', { name: birthYear }).click()
        await this.page.getByLabel(`${birthMonth} ${birthYear}`).click()
        await this.page.getByLabel(dateToAssert).click()
        await expect(this.page.locator('[name="birthDate"]')).toHaveValue(dateToAssert)

        await this.page.locator('#type').selectOption(type)
        await this.page.getByRole('button', { name: 'Save Pet' }).click()
    }

    async validatePhoneAndFirstPetName(phone: string, petName: string){
        await expect(this.page.locator('table').first().locator('tr td').last()).toContainText(phone)
        await expect(this.page.locator('.dl-horizontal dd').first()).toContainText(petName)
    }
}