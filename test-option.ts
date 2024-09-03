import { test as base } from '@playwright/test'
import { PageManager } from './page-objects/pageManager'
import { TestDataGeneration } from "./test-data/TestDataGeneration";


export type TestOptions = {
    ownerWithPetAndVisitSetup: string
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({
    ownerWithPetAndVisitSetup: async ({ page }, use) => {
        const randomOwnerFirstName = TestDataGeneration.randomOwnerFirstName()
        const randomOwnerLastName = TestDataGeneration.randomOwnerLastName()
        const randomOwnerAddress = TestDataGeneration.randomOwnerAddress()
        const randomOwnerCity = TestDataGeneration.randomOwnerCity()
        const randomOwnerPhoneNumber = TestDataGeneration.randomOwnerPhoneNumber()
        const randomPetName = TestDataGeneration.randomPetName()
        const firstRandomDescriptionForThePetVisit = TestDataGeneration.randomDescriptionForThePetVisit()
        const { birthYear, birthMonth, birthDay } = {
            birthYear: '2014',
            birthMonth: '05',
            birthDay: '02'
        }
        let date = new Date();
        
        await page.goto("/");   
        // const pm = new PageManager(page)
        // await pm.navigateTo().ownersPage()
        // await pm.onOwnersPage().openAddNewOwner()
        // await pm.onAddNewOwnerPage().addOwner(randomOwnerFirstName, randomOwnerLastName, randomOwnerAddress, randomOwnerCity, randomOwnerPhoneNumber)
        // await pm.onOwnersPage().openOwnerInfoPageFor(`${randomOwnerFirstName} ${randomOwnerLastName}`)
        // await pm.onOwnerInformationPage().openFormAddNewPet()
        // await pm.onAddNewPetPage().addPet(randomPetName, birthDay, birthMonth, birthYear, 'dog')
        // await pm.onOwnerInformationPage().openFormAddVisit(randomPetName, `${randomOwnerFirstName} ${randomOwnerLastName}`)
        // await pm.onAddNewVisitPage().addVisitForToday(firstRandomDescriptionForThePetVisit, date)
        // await pm.onOwnerInformationPage().validateVisitDateForPet(randomPetName, date)

        await use('')
    },

    pageManager: async ({ page, ownerWithPetAndVisitSetup}, use) => {
        const pm = new PageManager(page)
        await use(pm)
    }
})