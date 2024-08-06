import { expect, Page, test } from "@playwright/test";

export class NavigationPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async ownersPage() {
        await this.page.getByText(" Owners").click();
        await this.page.locator(".dropdown-menu").getByText(" Search").click();
    }

    async veterinariansPage() {
        const veterinariansMenu = this.page.getByText(" Veterinarians")
        await veterinariansMenu.click();
        const veterinariansMenuAll = this.page.locator(".dropdown-menu").getByText(" All")
        await veterinariansMenuAll.click()
        await expect(this.page.locator("h2")).toHaveText("Veterinarians");

    }

    async specialtiesPage() {
        await this.page.getByRole('link', { name: 'Specialties' }).click()
        await expect(this.page.locator("h2")).toHaveText("Specialties");
    }

    async petTypesPage() {
        await this.page.getByText(" Pet Types").click();
        await expect(this.page.locator("h2")).toHaveText("Pet Types");
    }

}