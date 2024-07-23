import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByText(" Owners").click();
    await page.getByText("Search").click();
    await expect(page.locator("h2")).toHaveText("Owners");
});

test('Select the desired date in the calendar', async ({ page }) => {
    await page.getByRole('link', { name: 'Harold Davis' }).click()
    await page.getByRole('button', { name: 'Add New Pet' }).click()

    const icon = page.locator('span.glyphicon.form-control-feedback').first()
    await page.waitForTimeout(8000)
    await expect(icon).toHaveClass(/glyphicon-remove/)
    await page.locator('#name').fill('Tom')
    await expect(icon).toHaveClass(/glyphicon-ok/);

    await page.getByLabel('Open calendar').click();

    const searchYear = '2014';
    const searchMonth = '05';
    const searchDay = '02';
    const dateToAssert = `${searchYear}/${searchMonth}/${searchDay}`

    await page.getByLabel('Choose month and year').click()
    let calendarHeader = await page.getByLabel('Choose date').textContent()
    let yearFrom = calendarHeader?.split(' – ').map(Number)[0]

    while (yearFrom && (yearFrom > Number(searchYear))) {
        await page.getByLabel('Previous 24 years').click()
        calendarHeader = await page.getByLabel('Choose date').textContent()
        yearFrom = calendarHeader?.split(' – ').map(Number)[0]
    }
    
    await page.getByText(searchYear).click()
    await page.getByText('May').click()
    await page.locator('[class="mat-calendar-body-cell"]').getByText(searchDay[0] == '0' ? searchDay.slice(1) : searchDay, { exact: true }).click()
    await expect(page.locator('[name="birthDate"]')).toHaveValue(dateToAssert)

    await page.locator('#type').selectOption('dog')
    await page.getByRole('button', { name: 'Save Pet' }).click()

    const petItem = page.locator('td', { has: page.getByText('Tom') })
    await expect(petItem).toBeVisible();
    await expect(petItem).toContainText(`${searchYear}-${searchMonth}-${searchDay}`)
    await expect(petItem).toContainText('dog')
    await petItem.getByRole('button', { name: "Delete Pet" }).click()
    await expect(petItem).toHaveCount(0)
})

test('Select the desired date in the calendar 2', async ({ page }) => {
    await page.getByRole('link', { name: 'Jean Coleman' }).click()

    const addVisitBtnOnTheOwnerPage = page.locator('td', { has: page.getByText('Samantha') }).getByRole('button', { name: "Add Visit" })
    await addVisitBtnOnTheOwnerPage.click()
    await expect(page.locator('h2')).toHaveText('New Visit')
    await expect(page.locator('tr', { has: page.getByText('Samantha') })).toContainText('Jean Coleman')

    const datePickerIcon = page.getByLabel('Open calendar')
    await datePickerIcon.click()
    await page.locator('span.mat-calendar-body-today').click()

    function formatDate(date: Date, expectedFormat: string) {
        if (!expectedFormat) {
            throw new Error('The expectedFormat parameter is required.');
        }

        const year = date.getFullYear();
        const month = date.toLocaleString('EN-US', { month: '2-digit' });
        const day = date.toLocaleString('EN-US', { day: '2-digit' });

        if (expectedFormat === 'YYYY/MM/DD') {
            return `${year}/${month}/${day}`;
        } else if (expectedFormat === 'YYYY-MM-DD') {
            return `${year}-${month}-${day}`;
        } else if (expectedFormat === 'MM YYYY') {
            return `${month} ${year}`;
        } else {
            throw new Error('The provided expectedFormat is not supported.');
        }
    }

    let date = new Date();
    const formattedDateOnTheNewVisitPage = formatDate(date, 'YYYY/MM/DD');
    const formattedDateOnTheOwnerPage = formatDate(date, 'YYYY-MM-DD');

    await expect(page.locator('[name="date"]')).toHaveValue(formattedDateOnTheNewVisitPage)

    await page.locator('#description').fill('dermatologists visit')
    const addVisitBtnOnTheVisitPage = page.getByRole('button', { name: 'Add Visit' })
    await addVisitBtnOnTheVisitPage.click()

    const firstVisitRowInfoForSamantha = page.locator('app-pet-list', { has: page.getByText('Samantha') }).locator('app-visit-list tr td').first()
    await expect(firstVisitRowInfoForSamantha).toHaveText(formattedDateOnTheOwnerPage)
    await addVisitBtnOnTheOwnerPage.click()

    date.setDate(date.getDate() - 45)
    const previousDate = date.getDate().toString()
    const formattedDateInCalendarInput = formatDate(date, 'MM YYYY');

    await page.locator('#description').fill('massage therapy')
    await datePickerIcon.click()
    let calendarMonthAndYear = await page.locator('[aria-label="Choose month and year"]').textContent()

    while (!calendarMonthAndYear?.includes(formattedDateInCalendarInput)) {
        await page.locator('[aria-label="Previous month"]').click()
        calendarMonthAndYear = await page.locator('[aria-label="Choose month and year"]').textContent()
    }

    await page.locator('[class="mat-calendar-body-cell"]').getByText(previousDate, { exact: true }).click()
    await addVisitBtnOnTheVisitPage.click()

    const firstsRowElement = page.locator('app-pet-list', { has: page.getByText('Samantha') }).locator('app-visit-list').locator('tr', { has: page.getByText('dermatologists visit') })
    const secondRowElement = page.locator('app-pet-list', { has: page.getByText('Samantha') }).locator('app-visit-list').locator('tr', { has: page.getByText('massage therapy') })
    const firstDateValue = await firstsRowElement.locator('td').first().textContent()
    const secondDateValue = await secondRowElement.locator('td').first().textContent()

    const firstDate = new Date(firstDateValue!);
    const secondDate = new Date(secondDateValue!);
    expect(firstDate > secondDate).toBeTruthy();

    await firstsRowElement.getByRole('button', { name: 'Delete Visit' }).click()
    await secondRowElement.getByRole('button', { name: 'Delete Visit' }).click()

})