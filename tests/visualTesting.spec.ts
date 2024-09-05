import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { TestDataGeneration } from "../test-data/TestDataGeneration";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const pm = new PageManager(page)
    await pm.navigateTo().ownersPage()
});

test('Validate selected pet types from the list', async ({ page }) => {
    const randomOwnerFirstName = TestDataGeneration.randomOwnerFirstName()
    const randomOwnerLastName = TestDataGeneration.randomOwnerLastName()
    const randomOwnerAddress = TestDataGeneration.randomOwnerAddress()
    const randomOwnerCity = TestDataGeneration.randomOwnerCity()
    const randomOwnerPhoneNumber = TestDataGeneration.randomOwnerPhoneNumber()

    const pm = new PageManager(page)
    await pm.onOwnersPage().openAddNewOwner()
    const addOwnerButton = page.getByRole('button', { name: 'Add Owner' })
    await expect(addOwnerButton).toHaveScreenshot()
    await pm.onAddNewOwnerPage().fillAllInputs(randomOwnerFirstName, randomOwnerLastName, randomOwnerAddress, randomOwnerCity, randomOwnerPhoneNumber)
    await expect(addOwnerButton).toHaveScreenshot()
})