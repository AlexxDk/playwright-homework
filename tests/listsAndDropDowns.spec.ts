import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByText(" Owners").click();
    await page.locator(".dropdown-menu").getByText(" Search").click();
    await expect(page.locator("h2")).toHaveText("Owners");
});

test('Validate selected pet types from the list', async ({ page }) => {
    await page.getByRole('link', { name: 'George Franklin' }).click()
    await expect(page.locator('.ownerFullName')).toHaveText('George Franklin')

    await page.locator('td', { has: page.getByText('Leo') }).getByRole('button', { name: "Edit Pet" }).click()
    await expect(page.locator("h2")).toHaveText(" Pet ");
    await expect(page.locator('#owner_name')).toHaveValue('George Franklin')
    await expect(page.locator('#type1')).toHaveValue('cat')

    await page.locator('#type').click()

    const pettypeItems = await page.locator("#type option").allTextContents();

    for (const pettypeItem of pettypeItems) {
        await page.locator('#type').selectOption(pettypeItem)
        await expect(page.locator('#type1')).toHaveValue(pettypeItem)

        await page.locator('#type').click()
    }
})

test('Validate the pet type update', async ({ page }) => {
    await page.getByRole('link', { name: 'Eduardo Rodriquez' }).click()

    const visitRosy = page.locator('td', { has: page.getByText('Rosy') })
    await visitRosy.getByRole('button', { name: "Edit Pet" }).click()
    await expect(page.locator('#name')).toHaveValue('Rosy')
    await expect(page.locator('#type1')).toHaveValue('dog')

    await page.locator('#type').click()
    await page.locator('#type').selectOption('bird')
    await expect(page.locator('#type1')).toHaveValue('bird')

    await page.getByRole('button', { name: 'Update Pet' }).click()
    await expect(visitRosy.locator('dd', {hasText: 'bird'})).toHaveText('bird')

    await visitRosy.getByRole('button', { name: "Edit Pet" }).click()
    await page.locator('#type').click()
    await page.locator('#type').selectOption('dog')
    await expect(page.locator('#type1')).toHaveValue('dog')

    await page.getByRole('button', { name: 'Update Pet' }).click()
    await expect(visitRosy.locator('dd', {hasText: 'dog'})).toHaveText('dog')

})