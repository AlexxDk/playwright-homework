import { expect, Page, test } from "@playwright/test";

export class PetTypesPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }
}