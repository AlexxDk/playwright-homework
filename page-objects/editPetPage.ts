import { expect, Page, test } from "@playwright/test";

export class EditPetPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async validateOwnerAndTypeInfo(ownerName: string, petType: string) {
        await expect(this.page.locator('#owner_name')).toHaveValue(ownerName)
        await expect(this.page.locator('#type1')).toHaveValue(petType)
    }

    async validatePetNameAndType(petName: string, petType: string) {
        await expect(this.page.locator('#name')).toHaveValue(petName)
        await expect(this.page.locator('#type1')).toHaveValue(petType)
    }

    async validateSelectingAllPetTypes() {
        const pettypeItems = await this.page.locator("#type option").allTextContents();

        for (const pettypeItem of pettypeItems) {
            await this.page.locator('#type').selectOption(pettypeItem)
            await expect(this.page.locator('#type1')).toHaveValue(pettypeItem)
        }
    }

    async updatePetTypeTo(type: string){
        const typeDropdown = this.page.locator('#type')
        await typeDropdown.click()
        await typeDropdown.selectOption(type)
        await expect(this.page.locator('#type1')).toHaveValue(type)
        await this.page.getByRole('button', { name: 'Update Pet' }).click()
    }
}