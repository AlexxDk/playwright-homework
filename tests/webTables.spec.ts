import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { OwnersPage } from "../page-objects/ownersPage";

test.describe('OWNERS page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        const pm = new PageManager(page)
        await pm.navigateTo().ownersPage()
    });

    test('Validate the pet name city of the owner', async ({ page }) => {
        const onOwnersPage = new OwnersPage(page)
        await onOwnersPage.validatePetNamesAndCityOfOwnerByPhoneNumber('6085555387', 'Monona', 'Lucky')
    })

    test('Validate owners count of the Madison city', async ({ page }) => {
        await page.waitForSelector('tbody')
        await expect(page.getByRole('row', { name: "Madison" })).toHaveCount(4)
    })

    test('Validate search by Last Name', async ({ page }) => {
        const onOwnersPage = new OwnersPage(page)
        await onOwnersPage.ValidateSearchByLastName('Black')
        await onOwnersPage.ValidateSearchByLastName('Davis')
        await onOwnersPage.ValidateSearchByLastName('Es')
        await onOwnersPage.ValidateSearchByLastName('Playwright')
    })

    test('Validate phone number and pet name on the Owner Information page', async ({ page }) => {
        const pm = new PageManager(page)
        const petName = await pm.onOwnersPage().selectOwnerByPhoneAndGetItsPets('6085552765')
        await pm.onOwnerInformationPage().validatePhoneAndFirstPetName('6085552765', petName)
    })

    test('Validate pets of the Madison city', async ({ page }) => {
        await page.waitForSelector('table')

        const expectedList = [" Leo ", " George ", " Mulligan ", " Freddy "]
        let petList: string[] = []

        const allRows = page.getByRole('row', { name: "Madison" })

        for (const row of await allRows.all()) {
            const petsValue = await row.locator('td').nth(4).textContent() || ''
            petList.push(petsValue)
        }
        expect(petList).toEqual(expectedList)

    })
})

test('Validate specialty update', async ({ page }) => {
    await page.goto("/");
    const pm = new PageManager(page)
    await pm.navigateTo().veterinariansPage()

    await pm.onVeterinariansPage().validateSpecialtyForVeterinarian(" Rafael Ortega ", 'surgery')
    await pm.navigateTo().specialtiesPage()

    await pm.onSpecialtiesPage().selectEditSpecialtyByIndex(1)
    await pm.onEditSpecialtyPage().updateSpecialtyTo('dermatology')

    await pm.navigateTo().veterinariansPage()

    await pm.onVeterinariansPage().validateSpecialtyForVeterinarian(" Rafael Ortega ", 'dermatology')
    await pm.navigateTo().specialtiesPage()

    await pm.onSpecialtiesPage().selectEditSpecialtyByIndex(1)
    await pm.onEditSpecialtyPage().updateSpecialtyTo('surgery')
})

test('Validate specialty lists', async ({ page }) => {
    await page.goto("/");
    const pm = new PageManager(page)
    await pm.navigateTo().specialtiesPage()

    await pm.onSpecialtiesPage().addNewSpecialty('oncology')

    const allSpecialtiesOnTheVeterinarianPage = await pm.onSpecialtiesPage().listOfAllSpecialties()

    await pm.navigateTo().veterinariansPage()

    await pm.onVeterinariansPage().selectEditVetByName(' Sharon Jenkins ')
    await pm.onEditVeterinariansPage().validateDropdownListAndUpdateVetTo('oncology', allSpecialtiesOnTheVeterinarianPage)
    await pm.onVeterinariansPage().validateSpecialtyForVeterinarian(' Sharon Jenkins ', 'oncology')

    await pm.navigateTo().specialtiesPage()
    await pm.onSpecialtiesPage().deleteLastSpecialty()

    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateSpecialtyForVeterinarian(' Sharon Jenkins ', 'empty')
})