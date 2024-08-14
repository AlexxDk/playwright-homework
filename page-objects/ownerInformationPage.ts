import { expect, Page, test } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class OwnerInformationPage extends HelperBase {
    constructor(page: Page) {
        super(page)
    }

    async openFormAddNewPet() {
        await this.page.getByRole('button', { name: 'Add New Pet' }).click()
    }

    async openFormAddVisit(petName: string, ownerName: string) {
        await this.page.locator('td', { has: this.page.getByText(petName) }).getByRole('button', { name: "Add Visit" }).click()
        await expect(this.page.locator('h2')).toHaveText('New Visit')
        await expect(this.page.locator('tr', { has: this.page.getByText(petName) })).toContainText(ownerName)

    }

    async validatePhoneAndFirstPetName(phone: string, petName: string) {
        await expect(this.page.locator('table').first().locator('tr td').last()).toContainText(phone)
        await expect(this.page.locator('.dl-horizontal dd').first()).toContainText(petName)
    }

    async validatePetInfo(name: string, birthDay: string, birthMonth: string, birthYear: string, type: string) {
        const petItem = this.page.locator('td', { has: this.page.getByText(name) })
        await expect(petItem).toBeVisible();
        await expect(petItem).toContainText(`${birthYear}-${birthMonth}-${birthDay}`)
        await expect(petItem).toContainText(type)
        return petItem
    }

    async deletePetByName(name: string) {
        await this.page.locator('td', { has: this.page.getByText(name) })
            .getByRole('button', { name: "Delete Pet" }).click()
    }

    async validateVisitDateForPet(petName: string, date: Date) {
        const formattedDateOnTheOwnerPage = this.formatDate(date, 'YYYY-MM-DD');
        const firstVisitRowInfoForSamantha = this.page.locator('app-pet-list', { has: this.page.getByText(petName) }).locator('app-visit-list tr td').first()
        await expect(firstVisitRowInfoForSamantha).toHaveText(formattedDateOnTheOwnerPage)
    }

    async compareTwoVisitsDatesForPet(petName: string, firstVisitDescription: string, secondVisitDescription: string) {
        const firstDateValue = await this.returnVisitRowByPetAndDescription(petName, firstVisitDescription).locator('td').first().textContent()
        const secondDateValue = await this.returnVisitRowByPetAndDescription(petName, secondVisitDescription).locator('td').first().textContent()
        const firstDate = new Date(firstDateValue!);
        const secondDate = new Date(secondDateValue!);
        expect(firstDate > secondDate).toBeTruthy();
    }

    async deleteVisitForPet(petName: string, description: string) {
        await this.returnVisitRowByPetAndDescription(petName, description)
            .getByRole('button', { name: 'Delete Visit' }).click()

    }

    private returnVisitRowByPetAndDescription(petName: string, description: string) {
        return this.page.locator('app-pet-list', { has: this.page.getByText(petName) }).locator('app-visit-list').locator('tr', { has: this.page.getByText(description) })
    }
}