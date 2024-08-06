import { expect, Page, test } from "@playwright/test";

export class PetTypesPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async updatePetTypeTo(petType: string) {
        const catPetTypeInTable = this.page.locator("tr", {
            has: this.page.locator('[id="0"]'),
        });
        await catPetTypeInTable.getByRole("button", { name: "Edit" }).click();

        await expect(this.page.locator("h2")).toHaveText("Edit Pet Type");

        const petTypeInput = this.page.locator("#name");
        await petTypeInput.click();
        await petTypeInput.clear();

        await petTypeInput.fill(petType);
        await this.page.getByRole("button", { name: "Update" }).click();

        await expect(catPetTypeInTable.locator("input")).toHaveValue(petType);
    }

    async cancelPetTypeUpdating(newPetType: string, oldPetType: string) {
        const dogPetTypeInTable = this.page.locator("tr", {
            has: this.page.locator('[id="1"]'),
        });
        await dogPetTypeInTable.getByRole("button", { name: "Edit" }).click();

        const petTypeInput = this.page.locator("#name");
        await petTypeInput.click();
        await petTypeInput.clear();
        await petTypeInput.fill(newPetType);

        await expect(petTypeInput).toHaveValue(newPetType);

        await this.page.getByRole("button", { name: "Cancel" }).click();

        await expect(dogPetTypeInTable.locator("input")).toHaveValue(oldPetType);
    }

    async validationMessageChecking(message: string) {
        const lizardPetTypeInTable = this.page.locator("tr", {
            has: this.page.locator('[id="2"]'),
        });
        await lizardPetTypeInTable.getByRole("button", { name: "Edit" }).click();

        const petTypeInput = this.page.locator("#name");
        await petTypeInput.click();
        await petTypeInput.clear();

        const validationMessage = await petTypeInput
            .locator("..")
            .locator(".help-block")
            .textContent();
        expect(validationMessage).toEqual(message);

        await this.page.getByRole("button", { name: "Cancel" }).click();

        await expect(this.page.locator("h2")).toHaveText("Pet Types");
    }
}