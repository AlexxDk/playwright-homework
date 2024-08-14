import { expect, Page, test } from "@playwright/test";
import { HelperBase } from "./helperBase";


export class AddNewVisitPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    async addVisitForToday(description: string, date: Date) {
        await this.page.getByLabel('Open calendar').click()
        await this.page.locator('span.mat-calendar-body-today').click()

        const formattedDateOnTheNewVisitPage = this.formatDate(date, 'YYYY/MM/DD');

        await expect(this.page.locator('[name="date"]')).toHaveValue(formattedDateOnTheNewVisitPage)

        await this.page.locator('#description').fill(description)
        this.page.getByRole('button', { name: 'Add Visit' }).click()
    }

    async addVisitForSelectedDate(description: string, date: Date) {
        const previousDate = date.getDate().toString()
        const formattedDateInCalendarInput = this.formatDate(date, 'MM YYYY');

        await this.page.locator('#description').fill(description)
        await this.page.getByLabel('Open calendar').click()
        let calendarMonthAndYear = await this.page.locator('[aria-label="Choose month and year"]').textContent()

        while (!calendarMonthAndYear?.includes(formattedDateInCalendarInput)) {
            await this.page.locator('[aria-label="Previous month"]').click()
            calendarMonthAndYear = await this.page.locator('[aria-label="Choose month and year"]').textContent()
        }

        await this.page.locator('[class="mat-calendar-body-cell"]').getByText(previousDate, { exact: true }).click()
        this.page.getByRole('button', { name: 'Add Visit' }).click()
    }
}