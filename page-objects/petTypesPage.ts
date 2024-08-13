import { expect, Page, test } from "@playwright/test";

export class PetTypesPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async selectEditPetByIndex(index: number) {
        const firstPetType = this.page.locator("tr", {
            has: this.page.locator(`[id="${index}"]`),
        });
        await firstPetType.getByRole("button", { name: "Edit" }).click();
        await expect(this.page.locator("h2")).toHaveText("Edit Pet Type");
    }

    async validateRowValueByIndex(index: number, updatedPetName: string) {
        await expect(this.page.locator("tr", { has: this.page.locator(`[id="${index}"]`), })
            .locator("input")).toHaveValue(updatedPetName);
    }

    async openAddNewPetTypeForm() {
        await this.page.locator('.btn-default', { hasText: " Add " }).click()
        await expect(this.page.locator('.xd-container h2').last()).toHaveText('New Pet Type')
        const addNewPetForm = this.page.locator('.form-group')
        const inputNewPetType = addNewPetForm.locator('#name')
        await expect(addNewPetForm.locator('label')).toHaveText("Name")
        await expect(inputNewPetType).toBeVisible()
        return inputNewPetType
    }

    async fillFormAndSaveNewPetType(name: string) {
        await this.page.locator('.form-group').locator('#name').fill(name)
        await this.page.getByRole('button', { name: "Save" }).click()
    }

    async deleteLastPetType(name: string) {
        const lastInput = this.page.locator('[name="pettype_name"]').last()
        await expect(lastInput).toHaveValue(name)

        this.page.on('dialog', dialog => {
            expect(dialog.message()).toEqual('Delete the pet type?')
            dialog.accept()
        })

        await this.page.getByRole("button", { name: "Delete" }).last().click();
        await expect(lastInput).not.toHaveValue(name)
    }
}