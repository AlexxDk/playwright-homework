import { expect, Page, test } from "@playwright/test";

export class HelperBase {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    formatDate(date: Date, expectedFormat: string) {
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

}