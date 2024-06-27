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
    await expect(inputNewPetType).not.toBeVisible()
    const lastInput = page.locator('[name="pettype_name"]').last()
    await expect(lastInput).toHaveValue('pig')

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Delete the pet type?')
        dialog.accept()
    })

    
    await page.getByRole("button", { name: "Delete" }).last().click();
    await expect(lastInput).not.toHaveValue('pig')

});