import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
    await page.goto("/");

    const pm = new PageManager(page)
    await pm.navigateTo().ownersPage()
});

test('Select the desired date in the calendar', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.onOwnerInformationPage().openFormAddNewPetForOwner('Harold Davis')

    const { birthYear, birthMonth, birthDay } = {
        birthYear: '2014',
        birthMonth: '05',
        birthDay: '02'
    }

    await pm.onOwnerInformationPage().addNewPet('Tom', birthDay, birthMonth, birthYear, 'dog')

    const petItem = page.locator('td', { has: page.getByText('Tom') })
    await expect(petItem).toBeVisible();
    await expect(petItem).toContainText(`${birthYear}-${birthMonth}-${birthDay}`)
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