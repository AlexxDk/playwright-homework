import { expect, Page, test } from "@playwright/test";

export class PetDetailsPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async updatePetTypeTo(newPetType: string) {
        this.clearOldAndFillNewPetTypeToInputField(newPetType)
        await this.page.getByRole("button", { name: "Update" }).click();
    }

    async cancelUpdateOfPetType() {
        await this.page.getByRole("button", { name: "Cancel" }).click();
    }

    async clearOldAndFillNewPetTypeToInputField(newPetType: string) {
        const petTypeInput = this.page.locator("#name");
        await petTypeInput.click();
        await petTypeInput.clear();
        await petTypeInput.fill(newPetType);
        await expect(petTypeInput).toHaveValue(newPetType);
    }

    async validationMessageChecking(message: string) {
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