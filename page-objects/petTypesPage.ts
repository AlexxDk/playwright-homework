import { expect, Page, test } from "@playwright/test";

export class PetTypesPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }


/**
 * 
 * @param positionID -- starts from 0
 * @returns 
 */
    async startEditPetTypeOnPosition(positionID: number) {
        const petTypeInTable = this.page.locator("tr", {
            has: this.page.locator(`[id="${positionID}"]`),
        });
        await petTypeInTable.getByRole("button", { name: "Edit" }).click();

        await expect(this.page.locator("h2")).toHaveText("Edit Pet Type");
        return petTypeInTable
    }

    async clearPetTypeFromInput() {
        const petTypeInput = this.page.locator("#name");
        await petTypeInput.click();
        await petTypeInput.clear();
        return petTypeInput
    }
}