import { expect, Page, test } from "@playwright/test";

export class OwnersPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async ValidateThePetNameCityOfTheOwner(phone: string, city: string, pets: string) {
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

    async ValidatePhoneNumberAndPetName(phone: string, ownerName: string){
        const ownerRow = this.page.getByRole('row', { name: phone })
        const petName = await ownerRow.locator('td').last().textContent() || ''

        await ownerRow.getByRole('link', { name: ownerName }).click()
        await expect(this.page.locator('table').first().locator('tr td').last()).toContainText(phone)
        await expect(this.page.locator('.dl-horizontal dd').first()).toContainText(petName)

    }

   


}