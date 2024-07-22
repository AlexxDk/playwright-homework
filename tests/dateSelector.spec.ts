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

test('Select the desired date in the calendar 2', async ({ page }) => {
    await page.getByRole('link', { name: 'Jean Coleman' }).click()

    const petItem = page.locator('td', { has: page.getByText('Samantha') })
    const addVisitBtnOnTheOwnerPage = petItem.getByRole('button', { name: "Add Visit" })
    await addVisitBtnOnTheOwnerPage.click()
    await expect(page.locator('h2')).toHaveText('New Visit')
    await expect(page.locator('tr', { has: page.getByText('Samantha') })).toContainText('Jean Coleman')

    const calendarInputField = page.locator('[class="mat-mdc-button-touch-target"]')
    await calendarInputField.click()
    await page.locator('span.mat-calendar-body-today').click()

    function formatDate(date, page = 'calendar') {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        if (page == 'visit') {
            return `${year}/${month}/${day}`
        } else if (page == 'owner') {
            return `${year}-${month}-${day}`
        }
        return `${month} ${year}`

    }

    let date = new Date();
    const formattedDateOnTheNewVisitPage = formatDate(date, 'visit');
    const formattedDateOnTheOwnerPage = formatDate(date, 'owner');

    await expect(page.locator('[name="date"]')).toHaveValue(formattedDateOnTheNewVisitPage)

    await page.locator('#description').fill('dermatologists visit')
    const addVisitBtnOnTheVisitPage = page.getByRole('button', { name: 'Add Visit' })
    await addVisitBtnOnTheVisitPage.click()

    const newVisitInfo = await page.locator('app-pet-list', { has: page.getByText('Samantha') }).locator('app-visit-list tr td').first()
    await expect(newVisitInfo).toHaveText(formattedDateOnTheOwnerPage)
    await addVisitBtnOnTheOwnerPage.click()

    date.setDate(date.getDate() - 45)
    const previousDate = date.getDate().toString()
    const previousMonthAndDate = formatDate(date);

    await page.locator('#description').fill('massage therapy')
    await calendarInputField.click()
    let calendarMonthAndYear = await page.locator('[aria-label="Choose month and year"]').textContent()

    while (!calendarMonthAndYear?.includes(previousMonthAndDate)) {
        await page.locator('[aria-label="Previous month"]').click()
        calendarMonthAndYear = await page.locator('[aria-label="Choose month and year"]').textContent()
    }

    await page.locator('[class="mat-calendar-body-cell"]').getByText(previousDate, { exact: true }).click()
    await addVisitBtnOnTheVisitPage.click()

    const firstsRowElement = page.locator('app-pet-list', { has: page.getByText('Samantha') }).locator('app-visit-list').locator('tr', { has: page.getByText('dermatologists visit') })
    const secondRowElement = page.locator('app-pet-list', { has: page.getByText('Samantha') }).locator('app-visit-list').locator('tr', { has: page.getByText('massage therapy') })
    const firstDateValue = await firstsRowElement.locator('td').first().textContent()
    const secondDateValue = await secondRowElement.locator('td').first().textContent()

    if (firstDateValue && secondDateValue) {
        const firstDate = new Date(firstDateValue);
        const secondDate = new Date(secondDateValue);
        expect(firstDate > secondDate).toBeTruthy();
    }

    await firstsRowElement.getByRole('button', { name: 'Delete Visit' }).click()
    await secondRowElement.getByRole('button', { name: 'Delete Visit' }).click()

})