import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { TestDataGeneration } from "../test-data/TestDataGeneration";

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

    const randomPetName = TestDataGeneration.randomPetName()
    await pm.onAddNewPetPage().addPet(randomPetName, birthDay, birthMonth, birthYear, 'dog')
    const petSelectorByName = await pm.onOwnerInformationPage().validatePetInfo(randomPetName, birthDay, birthMonth, birthYear, 'dog')
    await pm.onOwnerInformationPage().deletePetByName(randomPetName)
    await expect(petSelectorByName).toHaveCount(0)
})

test('Select the desired date in the calendar 2', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.onOwnersPage().openOwnerInfoPageFor('Jean Coleman')
    
    const firstRandomDescriptionForThePetVisit = TestDataGeneration.randomDescriptionForThePetVisit()
    const secondRandomDescriptionForThePetVisit = TestDataGeneration.randomDescriptionForThePetVisit()

    await pm.onOwnerInformationPage().openFormAddVisit('Samantha', 'Jean Coleman')
    let date = new Date();
    await pm.onAddNewVisitPage().addVisitForToday(firstRandomDescriptionForThePetVisit, date)
    await pm.onOwnerInformationPage().validateVisitDateForPet('Samantha', date)

    await pm.onOwnerInformationPage().openFormAddVisit('Samantha', 'Jean Coleman')
    date.setDate(date.getDate() - 45)
    await pm.onAddNewVisitPage().addVisitForSelectedDate(secondRandomDescriptionForThePetVisit, date)
    await pm.onOwnerInformationPage().compareTwoVisitsDatesForPet('Samantha', firstRandomDescriptionForThePetVisit, secondRandomDescriptionForThePetVisit)

    await pm.onOwnerInformationPage().deleteVisitForPet('Samantha', firstRandomDescriptionForThePetVisit)
    await pm.onOwnerInformationPage().deleteVisitForPet('Samantha', secondRandomDescriptionForThePetVisit)
})