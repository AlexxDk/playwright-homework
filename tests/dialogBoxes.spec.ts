import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";

test("Add and delete pet type", async ({ page }) => {
    await page.goto("/");
    const pm = new PageManager(page)
    await pm.navigateTo().petTypesPage()

    const form = await pm.onPetTypesPage().openAddNewPetTypeForm()
    await pm.onPetTypesPage().fillFormAndSaveNewPetType('pig')
    await expect(form).not.toBeVisible()

    await pm.onPetTypesPage().deleteLastPetType('pig')
});