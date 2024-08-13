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
        const onOwnersPage = new OwnersPage(page)
        await onOwnersPage.ValidatePhoneNumberAndPetName('6085552765', 'Peter McTavish')
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
    const pm = new PageManager(page)
    await pm.navigateTo().veterinariansPage()

    await pm.onVeterinariansPage().validateSpecialtyForVeterinarian(" Rafael Ortega ", 'surgery')
    await pm.navigateTo().specialtiesPage()

    await pm.onSpecialtiesPage().specialtyUpdate('dermatology')
    await pm.navigateTo().veterinariansPage()

    await pm.onVeterinariansPage().validateSpecialtyForVeterinarian(" Rafael Ortega ", 'dermatology')
    await pm.navigateTo().specialtiesPage()

    await pm.onSpecialtiesPage().specialtyUpdate('surgery')
})

test('Validate specialty lists', async ({ page }) => {
    await page.goto("/");
    const pm = new PageManager(page)
    await pm.navigateTo().specialtiesPage()

    await pm.onSpecialtiesPage().addNewSpecialty('oncology')

    // const allSpecialtiesValues = page.locator('td input')
    // let specialtiesList: string[] = []

    // for (const specialty of await allSpecialtiesValues.all()) {
    //     specialtiesList.push(await specialty.inputValue())
    // }
    const allSpecialtiesOnTheVeterinarianPage = await pm.onSpecialtiesPage().listOfAllSpecialties()

    await pm.navigateTo().veterinariansPage()

    // const sharonJenkinsRow = page.locator('tr', { has: page.getByText(' Sharon Jenkins ') })
    // await sharonJenkinsRow.getByRole('button', { name: 'Edit Vet' }).click()

    // await page.locator('.dropdown-display').click()
    // const allValuesFromDropDownMenu = await page.locator(".dropdown-content label").allTextContents()

    // expect(allSpecialtiesOnTheVeterinarianPage).toEqual(allValuesFromDropDownMenu)

    // await page.getByLabel('oncology').click()
    // await page.locator('.selected-specialties').click()
    // await page.getByRole('button', { name: 'Save Vet' }).click()
    // await expect(sharonJenkinsRow.locator('td').nth(1)).toContainText('oncology')
    await pm.onSpecialtiesPage().editVetForSpecificVeterinarian(' Sharon Jenkins ', 'oncology', allSpecialtiesOnTheVeterinarianPage)

    await pm.navigateTo().specialtiesPage()

    await page.locator('tbody tr').last().getByRole('button', { name: "Delete" }).click()

    await pm.navigateTo().veterinariansPage()

    await expect(page.locator('tr', { has: page.getByText(' Sharon Jenkins ') }).locator('td').nth(1)).toBeEmpty()

})