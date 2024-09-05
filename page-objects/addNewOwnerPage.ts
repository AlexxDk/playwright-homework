import { Page } from "@playwright/test";

export class AddNewOwnerPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async addOwner(firstName: string, lastName: string, address: string, city: string, telephone: string) {
        await this.fillAllInputs(firstName, lastName, address, city, telephone)
        await this.page.getByRole('button', { name: 'Add Owner' }).click()
    }

    async fillAllInputs(firstName: string, lastName: string, address: string, city: string, telephone: string) {
        await this.page.locator('#firstName').fill(firstName)
        await this.page.locator('#lastName').fill(lastName)
        await this.page.locator('#address').fill(address)
        await this.page.locator('#city').fill(city)
        await this.page.locator('#telephone').fill(telephone)
    }
}