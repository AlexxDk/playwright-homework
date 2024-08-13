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
}