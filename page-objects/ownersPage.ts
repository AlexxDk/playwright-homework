import { expect, Page, test } from "@playwright/test";

export class OwnersPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async validatePetNamesAndCityOfOwnerByPhoneNumber(phone: string, city: string, pets: string) {
        const ownerRow = this.page.getByRole('row', { name: phone })
        await expect(ownerRow.locator('td').nth(2)).toHaveText(city)
        await expect(ownerRow.locator('td').last()).toHaveText(pets)
    }

    async ValidateSearchByLastName(searchValue: string) {
        const inputLastName = this.page.locator('#lastName')
        const buttonFindOwner = this.page.getByRole('button', { name: 'Find Owner' })

        await inputLastName.clear()
        await inputLastName.fill(searchValue)
        await buttonFindOwner.click()
        await this.page.waitForResponse(`https://petclinic-api.bondaracademy.com/petclinic/api/owners?lastName=${searchValue}`)

        if (searchValue == 'Playwright') {
            await expect(this.page.locator('.xd-container div').last()).toContainText(`No owners with LastName starting with "${searchValue}"`)
            return;
        }

        const ownersList = this.page.locator('tbody tr', { has: this.page.locator('td').nth(2) })
        for (const row of await ownersList.all()) {
            await expect(row.locator('td').first()).toContainText(searchValue)
        }

    }

    async selectOwnerByPhoneAndGetItsPets(phone: string) {
        const ownerRow = this.page.getByRole('row', { name: phone })
        const petName = await ownerRow.locator('td').last().textContent() || ''
        await this.page.getByRole('row', { name: phone }).getByRole('link').click()
        return petName
    }

    async openOwnerInfoPageFor(ownerName: string) {
        await this.page.getByRole('link', { name: ownerName }).click()
        await expect(this.page.locator('.ownerFullName')).toHaveText(ownerName)
    }

    async openAddNewOwner() {
        await this.page.getByRole('button', { name: 'Add Owner' }).click()
    }

    async validateOwnerInfoInTheTable(ownerName: string, address: string, city: string, telephone: string) {
        const ownerRow = this.page.getByRole('row', { name: ownerName })
        await expect(ownerRow.locator('td').nth(1)).toContainText(address)
        await expect(ownerRow.locator('td').nth(2)).toContainText(city)
        await expect(ownerRow.locator('td').nth(3)).toContainText(telephone)
    }

    async ownerNoExistInTheList(ownerName: string) {
        await expect(this.page.getByRole('row', { name: ownerName })).toHaveCount(0)
    }
}