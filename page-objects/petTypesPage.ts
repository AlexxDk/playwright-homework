import { expect, Page, test } from "@playwright/test";

export class PetTypesPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async updatePetTypeTo(petType: string) {
        const firstPetType = this.page.locator("tr", {
            has: this.page.locator('[id="0"]'),
        });
        await firstPetType.getByRole("button", { name: "Edit" }).click();

        await expect(this.page.locator("h2")).toHaveText("Edit Pet Type");

        const petTypeInput = this.page.locator("#name");
        await petTypeInput.click();
        await petTypeInput.clear();

        await petTypeInput.fill(petType);
        await this.page.getByRole("button", { name: "Update" }).click();

        await expect(firstPetType.locator("input")).toHaveValue(petType);
    }

    async cancelPetTypeUpdating(newPetType: string, oldPetType: string) {
        const secondPetType = this.page.locator("tr", {
            has: this.page.locator('[id="1"]'),
        });
        await secondPetType.getByRole("button", { name: "Edit" }).click();

        const petTypeInput = this.page.locator("#name");
        await petTypeInput.click();
        await petTypeInput.clear();
        await petTypeInput.fill(newPetType);

        await expect(petTypeInput).toHaveValue(newPetType);

        await this.page.getByRole("button", { name: "Cancel" }).click();

        await expect(secondPetType.locator("input")).toHaveValue(oldPetType);
    }

    async validationMessageChecking(message: string) {
        const thirdPetType = this.page.locator("tr", {
            has: this.page.locator('[id="2"]'),
        });
        await thirdPetType.getByRole("button", { name: "Edit" }).click();

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