import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
    await page.goto("/");

    const pm = new PageManager(page)
    await pm.navigateTo().ownersPage()
});

test('Select the desired date in the calendar', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.onOwnersPage().openOwnerInfoPageFor('Harold Davis')
    await pm.onOwnerInformationPage().openFormAddNewPet()

    const { birthYear, birthMonth, birthDay } = {
        birthYear: '2014',
        birthMonth: '05',
        birthDay: '02'
    }

    await pm.onAddNewPetPage().addPet('Tom', birthDay, birthMonth, birthYear, 'dog')
    const pet = await pm.onOwnerInformationPage().validatePetInfo('Tom', birthDay, birthMonth, birthYear, 'dog')
    await pm.onOwnerInformationPage().deletePetByName('Tom')
    await expect(pet).toHaveCount(0)
})

test('Select the desired date in the calendar 2', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.onOwnersPage().openOwnerInfoPageFor('Jean Coleman')

    await pm.onOwnerInformationPage().openFormAddVisit('Samantha', 'Jean Coleman')
    let date = new Date();
    await pm.onAddNewVisitPage().addVisitForToday('dermatologists visit', date)
    await pm.onOwnerInformationPage().validateVisitDateForPet('Samantha', date)

    await pm.onOwnerInformationPage().openFormAddVisit('Samantha', 'Jean Coleman')
    date.setDate(date.getDate() - 45)
    await pm.onAddNewVisitPage().addVisitForSelectedDate('massage therapy', date)
    await pm.onOwnerInformationPage().compareTwoVisitsDatesForPet('Samantha', 'dermatologists visit', 'massage therapy')

    await pm.onOwnerInformationPage().deleteVisitForPet('Samantha', 'dermatologists visit')
    await pm.onOwnerInformationPage().deleteVisitForPet('Samantha', 'massage therapy')
})