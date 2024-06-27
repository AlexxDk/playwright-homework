import { test, expect } from "@playwright/test";

test("Add and delete pet type", async ({ page }) => {
    await page.goto("/");
    await page.getByText(" Pet Types").click();
    await expect(page.locator("h2")).toHaveText("Pet Types");

    await page.locator('.btn-default', { hasText: " Add " }).click()
    await expect(page.locator('.xd-container h2').last()).toHaveText('New Pet Type')

    const addNewPetForm = page.locator('.form-group')
    const inputNewPetType = addNewPetForm.locator('#name')
    await expect(addNewPetForm.locator('label')).toHaveText("Name")
    await expect(inputNewPetType).toBeVisible()

    await inputNewPetType.fill('pig')
    await page.getByRole('button', { name: "Save" }).click()

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Delete the pet type?')
        dialog.accept()
    })

    await page.locator('tr', { has: page.locator('[id="6"]') }).getByRole("button", { name: "Delete" }).click();
    await expect(page.locator('[name="pettype_name"]').last()).not.toHaveValue('pig')

});