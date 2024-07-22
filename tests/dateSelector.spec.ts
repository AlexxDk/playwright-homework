import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByText(" Owners").click();
    await page.locator(".dropdown-menu").getByText(" Search").click();
    await expect(page.locator("h2")).toHaveText("Owners");
});

test('Select the desired date in the calendar', async ({ page }) => {
    await page.getByRole('link', { name: 'Harold Davis' }).click()
    await page.getByRole('button', { name: 'Add New Pet' }).click()

    const icon = page.locator('span.glyphicon.form-control-feedback').first()
    await expect(icon).toHaveClass(/glyphicon-remove/);
    await page.locator('#name').fill('Tom')
    await expect(icon).toHaveClass(/glyphicon-ok/);

    await page.locator('.mat-mdc-button-touch-target').click()

    const searchYear = '2014';
    const searchMonth = '05';
    const searchDay = '02';
    const dateToAssert = `${searchYear}/${searchMonth}/${searchDay}`

    let calendarMonthAndYear = await page.locator('[aria-label="Choose month and year"]').textContent()

    while (!calendarMonthAndYear?.includes(`${searchMonth} ${searchYear}`)) {
        await page.locator('[aria-label="Previous month"]').click()
        calendarMonthAndYear = await page.locator('[aria-label="Choose month and year"]').textContent()
    }
    await page.locator('[class="mat-calendar-body-cell"]').getByText(searchDay[0] == '0' ? searchDay.slice(1) : searchDay, { exact: true }).click()
    await expect(page.locator('[name="birthDate"]')).toHaveValue(dateToAssert)

    await page.locator('#type').selectOption('dog')
    await page.getByRole('button', { name: 'Save Pet' }).click()

    const petItem = page.locator('td', { has: page.getByText('Tom') })
    await expect(petItem).toBeVisible();
    await expect(petItem).toContainText('2014-05-02')
    await expect(petItem).toContainText('dog')
    await petItem.getByRole('button', { name: "Delete Pet" }).click()
    await expect(petItem).toHaveCount(0)
})

